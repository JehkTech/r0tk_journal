import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthSession, User } from '../types';
import { SupabaseClient } from '@supabase/supabase-js';

const FALLBACK_JWT_SECRET = 'development-only-fallback-secret-change-me';
const JWT_EXPIRES_IN = '7d';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

interface JwtPayload {
  userId: string;
  username: string;
  sessionId: string;
}

interface LoginContext {
  userAgent?: string;
  ipAddress?: string;
}

export class AuthService {
  constructor(private db: SupabaseClient) {
    this.getJwtSecret();
  }

  private getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    const isProduction = process.env.NODE_ENV === 'production';
    const isWeak = !secret || secret === 'fallback-secret' || secret.length < 32;

    if (isProduction && isWeak) {
      throw new Error('JWT_SECRET must be set to a strong value in production.');
    }

    return isWeak ? FALLBACK_JWT_SECRET : secret;
  }

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

  async login(username: string, password: string, context: LoginContext = {}): Promise<{ user: User; token: string }> {
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

    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
    const { data: session, error: sessionError } = await this.db
      .from('auth_sessions')
      .insert({
        user_id: user.id,
        user_agent: context.userAgent,
        ip_address: context.ipAddress,
        expires_at: expiresAt,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (sessionError || !session) {
      throw sessionError || new Error('Failed to create auth session');
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, sessionId: (session as AuthSession).id },
      this.getJwtSecret(),
      { expiresIn: JWT_EXPIRES_IN }
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

  async verifyToken(token: string): Promise<JwtPayload | null> {
    try {
      const decoded = jwt.verify(token, this.getJwtSecret()) as Partial<JwtPayload>;
      if (!decoded.userId || !decoded.username || !decoded.sessionId) {
        return null;
      }

      const { data: session, error } = await this.db
        .from('auth_sessions')
        .select('id')
        .eq('id', decoded.sessionId)
        .eq('user_id', decoded.userId)
        .is('revoked_at', null)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (error || !session) {
        return null;
      }

      return {
        userId: decoded.userId,
        username: decoded.username,
        sessionId: decoded.sessionId
      };
    } catch (error) {
      return null;
    }
  }

  async revokeSession(userId: string, sessionId: string): Promise<boolean> {
    const { data, error } = await this.db
      .from('auth_sessions')
      .update({
        revoked_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .eq('user_id', userId)
      .is('revoked_at', null)
      .select('id');

    if (error) {
      throw error;
    }

    return (data || []).length > 0;
  }

  async revokeUserSessions(userId: string): Promise<void> {
    const { error } = await this.db
      .from('auth_sessions')
      .update({
        revoked_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .is('revoked_at', null);

    if (error) {
      throw error;
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

    await this.revokeUserSessions(userId);

    return true;
  }
}
