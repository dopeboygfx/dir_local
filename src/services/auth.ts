import { db } from '../lib/db';
import type { User } from '../types';

// In a real app, use proper password hashing like bcrypt
function hashPassword(password: string): string {
  return btoa(password); // Basic encoding for demo purposes
}

function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
}

interface StoredUser extends User {
  hashedPassword: string;
  businessName?: string;
  businessAddress?: string;
}

// Admin credentials - In a real app, this would be in a secure environment variable
const ADMIN_EMAIL = 'admin@localbiz.com';
const ADMIN_PASSWORD = 'admin123';

// Initialize admin account if it doesn't exist
(() => {
  const admin = db.getUserByEmail(ADMIN_EMAIL);
  if (!admin) {
    db.addUser({
      email: ADMIN_EMAIL,
      name: 'Admin',
      hashedPassword: hashPassword(ADMIN_PASSWORD),
      role: 'admin'
    });
    console.log('Admin account created');
  }
})();

export const authService = {
  async createUser({ email, password, name }: { email: string; password: string; name: string }): Promise<User> {
    const existing = db.getUserByEmail(email);
    if (existing) {
      throw new Error('Email already exists');
    }

    const hashedPassword = hashPassword(password);
    const user = db.addUser({ 
      email, 
      name,
      hashedPassword,
      role: 'user' // Default role for new users
    });

    const { hashedPassword: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const storedUser = db.getUserByEmail(email) as StoredUser | undefined;
    if (!storedUser || !verifyPassword(password, storedUser.hashedPassword)) {
      throw new Error('Invalid email or password');
    }

    const token = btoa(JSON.stringify({ 
      userId: storedUser.id,
      role: storedUser.role,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    }));

    const { hashedPassword: _, ...userWithoutPassword } = storedUser;
    return { user: userWithoutPassword, token };
  },

  async verifyToken(token: string): Promise<{ userId: string }> {
    try {
      const decoded = JSON.parse(atob(token));
      
      if (decoded.exp < Date.now()) {
        throw new Error('Token expired');
      }

      return { userId: decoded.userId };
    } catch {
      throw new Error('Invalid token');
    }
  },

  async getUserById(id: string): Promise<User | null> {
    const user = db.getUserById(id) as StoredUser | undefined;
    if (!user) return null;

    const { hashedPassword: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async updateUser(
    id: string,
    data: {
      name: string;
      email: string;
      businessName?: string;
      businessAddress?: string;
    }
  ): Promise<User> {
    const user = db.getUserById(id) as StoredUser | undefined;
    if (!user) {
      throw new Error('User not found');
    }

    if (data.email !== user.email) {
      const existing = db.getUserByEmail(data.email);
      if (existing) {
        throw new Error('Email already exists');
      }
    }

    const updatedUser = db.updateUser(id, data);
    const { hashedPassword: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },

  async updatePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = db.getUserById(id) as StoredUser | undefined;
    if (!user) {
      throw new Error('User not found');
    }

    if (!verifyPassword(currentPassword, user.hashedPassword)) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = hashPassword(newPassword);
    db.updateUser(id, { hashedPassword });
  }
};