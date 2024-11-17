import { db } from '../lib/db';
import type { SubscriptionPlan, User } from '../types';

export const subscriptionService = {
  async subscribeToPlan(userId: string, plan: SubscriptionPlan): Promise<void> {
    // In a real app, integrate with a payment provider like Stripe
    const user = db.getUserById(userId);
    if (!user) throw new Error('User not found');

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update user's subscription
    db.updateUser(userId, {
      subscriptionPlan: plan,
      subscriptionStatus: 'active'
    });
  },

  async cancelSubscription(userId: string): Promise<void> {
    const user = db.getUserById(userId);
    if (!user) throw new Error('User not found');

    await new Promise(resolve => setTimeout(resolve, 1000));

    db.updateUser(userId, {
      subscriptionStatus: 'cancelled'
    });
  },

  async getSubscriptionStatus(userId: string): Promise<{
    plan: SubscriptionPlan | undefined;
    status: 'active' | 'cancelled' | 'expired' | undefined;
  }> {
    const user = db.getUserById(userId) as User;
    if (!user) throw new Error('User not found');

    return {
      plan: user.subscriptionPlan,
      status: user.subscriptionStatus
    };
  }
};