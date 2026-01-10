import { Low } from 'lowdb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../types';

interface DatabaseSchema {
  users: Array<User>;
  trades: Array<any>;
  screenshots: Array<any>;
  analytics_cache: Array<any>;
}

export class AuthService {
  constructor(private db: Low<DatabaseSchema>) {}

  async register(username: string, email: string, password: string): Promise<User> {
    // Check if user already exists
    const existingUser = this.db.data.users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      throw new Error('User with this username or email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user: User = {
      id: (this.db.data.users.length > 0 ? Math.max(...this.db.data.users.map(u => u.id)) : 0) + 1,
      username,
      email,
      password_hash: passwordHash,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.db.data.users.push(user);
    await this.db.write();
    
    return user;
  }

  async login(username: string, password: string): Promise<{ user: User; token: string }> {
    const user = this.db.data.users.find(u => u.username === username || u.email === username);
    
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

  async getUserById(userId: number): Promise<User | null> {
    const user = this.db.data.users.find(u => u.id === userId);
    return user || null;
  }

  verifyToken(token: string): { userId: number; username: string } | null {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      return { userId: decoded.userId, username: decoded.username };
    } catch (error) {
      return null;
    }
  }

  async updateUser(userId: number, updateData: { username?: string; email?: string }): Promise<User | null> {
    const userIndex = this.db.data.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return null;
    }

    const user = this.db.data.users[userIndex];
    const updatedUser = {
      ...user,
      ...updateData,
      updated_at: new Date().toISOString()
    };

    this.db.data.users[userIndex] = updatedUser;
    await this.db.write();
    
    const { password_hash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<boolean> {
    const userIndex = this.db.data.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = this.db.data.users[userIndex];
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    this.db.data.users[userIndex] = {
      ...user,
      password_hash: newPasswordHash,
      updated_at: new Date().toISOString()
    };

    await this.db.write();
    return true;
  }
}