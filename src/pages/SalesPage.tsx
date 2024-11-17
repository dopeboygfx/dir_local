import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, Users, Globe, Zap, 
  CheckCircle, BarChart, Shield, Award,
  Star
} from 'lucide-react';
import { Footer } from '../components/Footer';
import { PRICING_FEATURES, SUBSCRIPTION_PRICES, type SubscriptionPlan } from '../types';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    icon: Globe,
    title: 'Expand Your Reach',
    description: 'Get discovered by thousands of potential customers actively searching for local businesses.'
  },
  {
    icon: TrendingUp,
    title: 'Boost Your Growth',
    description: 'Increase foot traffic and online visibility with our powerful listing platform.'
  },
  {
    icon: Users,
    title: 'Build Customer Trust',
    description: 'Showcase reviews, photos, and business information to build credibility.'
  },
  {
    icon: Zap,
    title: 'Quick Setup',
    description: 'Create your business profile in minutes and start connecting with customers instantly.'
  }
];

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '10K+', label: 'Listed Businesses' },
  { value: '500K+', label: 'Monthly Searches' },
  { value: '98%', label: 'Customer Satisfaction' }
];

interface PlanCardProps {
  name: SubscriptionPlan;
  price: number;
  popular?: boolean;
  onSelect: (plan: SubscriptionPlan) => void;
}

function PlanCard({ name, price, popular, onSelect }: PlanCardProps) {
  const planFeatures = PRICING_FEATURES.filter(feature => {
    switch (name) {
      case 'free':
        return feature.free;
      case 'pro':
        return feature.pro;
      case 'enterprise':
        return feature.enterprise;
    }
  });

  return (
    <div
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${
        popular ? 'ring-2 ring-emerald-600 scale-105' : ''
      }`}
    >
      {popular && (
        <div className="bg-emerald-600 text-white text-center py-2 text-sm font-medium">
          Most Popular
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </h3>
        <div className="flex items-baseline mb-6">
          <span className="text-4xl font-bold text-gray-900">
            ${price}
          </span>
          {price > 0 && (
            <span className="text-gray-600 ml-1">/month</span>
          )}
        </div>
        <ul className="space-y-4 mb-6">
          {planFeatures.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-600">
              <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
              {feature.title}
            </li>
          ))}
        </ul>
        <button
          onClick={() => onSelect(name)}
          className={`w-full py-2 rounded-lg font-semibold ${
            popular
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          } transition-colors`}
        >
          {price === 0 ? 'Get Started Free' : 'Subscribe Now'}
        </button>
      </div>
    </div>
  );
}

export default function SalesPage() {
  const { user, isAuthenticated } = useAuth();

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (!isAuthenticated) {
      // Redirect to signup with selected plan
      window.location.href = `/signup?plan=${plan}`;
      return;
    }

    // Handle subscription for logged-in users
    if (plan === 'free') {
      window.location.href = '/create-listing';
    } else {
      // Redirect to payment page
      window.location.href = `/subscribe/${plan}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-emerald-900 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069"
            alt="Background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Grow Your Business with LocalBiz
            </h1>
            <p className="text-xl text-emerald-100 mb-8">
              Join thousands of successful local businesses reaching new customers every day
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create-listing"
                className="bg-white text-emerald-900 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
              >
                List Your Business
              </Link>
              <a
                href="#pricing"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools and features you need to attract more customers
              and grow your business.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, description }, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the plan that best fits your business needs. No hidden fees or long-term contracts.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PlanCard
              name="free"
              price={SUBSCRIPTION_PRICES.free}
              onSelect={handleSelectPlan}
            />
            <PlanCard
              name="pro"
              price={SUBSCRIPTION_PRICES.pro}
              popular
              onSelect={handleSelectPlan}
            />
            <PlanCard
              name="enterprise"
              price={SUBSCRIPTION_PRICES.enterprise}
              onSelect={handleSelectPlan}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied business owners who have grown their business with LocalBiz
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star key={starIndex} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "LocalBiz has transformed our business. We've seen a significant increase in customer
                  traffic and our online presence has never been stronger."
                </p>
                <div className="border-t pt-4">
                  <div className="font-medium text-gray-900">Sarah Johnson</div>
                  <div className="text-sm text-gray-600">Local Café Owner</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Grow Your Business?
            </h2>
            <p className="text-emerald-100 mb-8">
              Join LocalBiz today and start connecting with new customers in your area.
            </p>
            <Link
              to="/create-listing"
              className="bg-white text-emerald-900 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors inline-block"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}