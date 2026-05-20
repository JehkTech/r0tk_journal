import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../types';
import { SupabaseClient } from '@supabase/supabase-js';

export class AuthService {
  constructor(private db: SupabaseClient) {}

  async register(username: string, email: string, password: string): Promise<User> {
    // Check if user already exists
    const { data: existingUser, error: existingError } = await this.db
      .from('users')
      .select('id')
      .or(`username.eq.${username},email.eq.${email}`)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existingUser) {
      throw new Error('User with this username or email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const { data: user, error } = await this.db
      .from('users')
      .insert({
        username,
        email,
        password_hash: passwordHash,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error || !user) {
      throw error || new Error('Failed to create user');
    }

    return user as User;
  }

  async login(username: string, password: string): Promise<{ user: User; token: string }> {
    const { data: user, error } = await this.db
      .from('users')
      .select('*')
      .or(`username.eq.${username},email.eq.${username}`)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword as User, token };
  }

  async getUserById(userId: string): Promise<User | null> {
    const { data: user, error } = await this.db
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (user as User) || null;
  }

  verifyToken(token: string): { userId: string; username: string } | null {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      return { userId: decoded.userId, username: decoded.username };
    } catch (error) {
      return null;
    }
  }

  async updateUser(userId: string, updateData: { username?: string; email?: string }): Promise<User | null> {
    const { data: user, error } = await this.db
      .from('users')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select('*')
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!user) {
      return null;
    }

    const { password_hash, ...userWithoutPassword } = user as User;
    return userWithoutPassword as User;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const { data: user, error } = await this.db
      .from('users')
      .select('id, password_hash')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    const { error: updateError } = await this.db
      .from('users')
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    return true;
  }
}