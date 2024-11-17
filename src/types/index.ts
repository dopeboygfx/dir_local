import { LucideIcon } from 'lucide-react';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: 'user' | 'admin';
  subscriptionPlan?: SubscriptionPlan;
  subscriptionStatus?: 'active' | 'cancelled' | 'expired';
  businessName?: string;
  businessAddress?: string;
}

export interface Business {
  id: string;
  userId: string;
  name: string;
  category: string;
  description: string;
  location: string;
  phone: string;
  hours: string;
  image: string;
  website?: string;
  rating: number;
  featured: boolean;
  tags: string[];
  stats?: BusinessStats;
  reviews?: Review[];
}

export interface BusinessStats {
  views: number;
  websiteClicks: number;
  phoneClicks: number;
  viewsChange: number;
  websiteClicksChange: number;
  phoneClicksChange: number;
  ctr: number;
  ctrChange: number;
}

export interface Review {
  id: string;
  userId: string;
  businessId: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface SearchFilters {
  query: string;
  location: string;
  tags: string[];
}

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

export const SUBSCRIPTION_PRICES: Record<SubscriptionPlan, number> = {
  free: 0,
  pro: 29,
  enterprise: 99
};

export interface PricingFeature {
  title: string;
  free: boolean;
  pro: boolean;
  enterprise: boolean;
}

export const PRICING_FEATURES: PricingFeature[] = [
  {
    title: 'Basic business listing',
    free: true,
    pro: true,
    enterprise: true
  },
  {
    title: 'Customer reviews',
    free: true,
    pro: true,
    enterprise: true
  },
  {
    title: 'Business hours',
    free: true,
    pro: true,
    enterprise: true
  },
  {
    title: 'Contact information',
    free: true,
    pro: true,
    enterprise: true
  },
  {
    title: 'Single location',
    free: true,
    pro: true,
    enterprise: true
  },
  {
    title: 'Priority placement',
    free: false,
    pro: true,
    enterprise: true
  },
  {
    title: 'Multiple photos',
    free: false,
    pro: true,
    enterprise: true
  },
  {
    title: 'Business analytics',
    free: false,
    pro: true,
    enterprise: true
  },
  {
    title: 'Multiple locations',
    free: false,
    pro: true,
    enterprise: true
  },
  {
    title: 'Special offers & events',
    free: false,
    pro: true,
    enterprise: true
  },
  {
    title: 'Customer messaging',
    free: false,
    pro: true,
    enterprise: true
  },
  {
    title: 'API access',
    free: false,
    pro: false,
    enterprise: true
  },
  {
    title: 'Dedicated support',
    free: false,
    pro: false,
    enterprise: true
  },
  {
    title: 'Custom branding',
    free: false,
    pro: false,
    enterprise: true
  },
  {
    title: 'Integration support',
    free: false,
    pro: false,
    enterprise: true
  }
];

export const MAX_TAGS = 10;

export const PREDEFINED_TAGS = [
  'Coffee',
  'Restaurant',
  'Bakery',
  'Vegan',
  'Fast Food',
  'Fine Dining',
  'Bar',
  'Cafe',
  'Pizza',
  'Sushi',
  'Italian',
  'Mexican',
  'Asian',
  'Vegetarian',
  'Gluten-Free',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Takeout',
  'Delivery',
  'Outdoor Seating',
  'Family-Friendly',
  'Pet-Friendly',
  'Live Music',
  'Sports Bar',
  'Wine Bar',
  'Craft Beer',
  'Happy Hour',
  'Open Late',
  'Brunch'
];