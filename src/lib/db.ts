import { v4 as uuidv4 } from 'uuid';
import type { User, Business } from '../types';

interface StoredUser extends User {
  hashedPassword: string;
  businessName?: string;
  businessAddress?: string;
}

class LocalStorage {
  private getItem<T>(key: string): T[] {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  }

  private setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Users
  getUsers(): StoredUser[] {
    return this.getItem<StoredUser>('users');
  }

  addUser(user: Omit<StoredUser, 'id'>): StoredUser {
    const users = this.getUsers();
    const newUser = { ...user, id: uuidv4() };
    users.push(newUser);
    this.setItem('users', users);
    return newUser;
  }

  updateUser(id: string, updates: Partial<StoredUser>): StoredUser {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    
    users[index] = { ...users[index], ...updates };
    this.setItem('users', users);
    return users[index];
  }

  getUserByEmail(email: string): StoredUser | undefined {
    return this.getUsers().find(user => user.email === email);
  }

  getUserById(id: string): StoredUser | undefined {
    return this.getUsers().find(user => user.id === id);
  }

  // Businesses
  getBusinesses(): Business[] {
    return this.getItem<Business>('businesses');
  }

  addBusiness(business: Omit<Business, 'id'>): Business {
    const businesses = this.getBusinesses();
    const newBusiness = { ...business, id: uuidv4() };
    businesses.push(newBusiness);
    this.setItem('businesses', businesses);
    return newBusiness;
  }

  updateBusiness(id: string, updates: Partial<Business>): void {
    const businesses = this.getBusinesses();
    const index = businesses.findIndex(b => b.id === id);
    if (index !== -1) {
      businesses[index] = { ...businesses[index], ...updates };
      this.setItem('businesses', businesses);
    }
  }

  deleteBusiness(id: string): void {
    const businesses = this.getBusinesses();
    const filtered = businesses.filter(b => b.id !== id);
    this.setItem('businesses', filtered);
  }

  getBusinessById(id: string): Business | undefined {
    return this.getBusinesses().find(b => b.id === id);
  }

  getBusinessesByUserId(userId: string): Business[] {
    return this.getBusinesses().filter(b => b.userId === userId);
  }

  // Clear all data (for development)
  clear(): void {
    localStorage.clear();
  }
}

export const db = new LocalStorage();