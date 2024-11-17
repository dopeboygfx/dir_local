import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Shield, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { subscriptionService } from '../services/subscription';
import type { SubscriptionPlan } from '../types';
import { SUBSCRIPTION_PRICES, PRICING_FEATURES } from '../types';

export default function SubscribePage() {
  const { plan } = useParams<{ plan: SubscriptionPlan }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!plan || !['pro', 'enterprise'].includes(plan)) {
    navigate('/pricing');
    return null;
  }

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/signup');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await subscriptionService.subscribeToPlan(user.id, plan as SubscriptionPlan);
      navigate('/create-listing');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const planFeatures = PRICING_FEATURES.filter(feature => {
    return plan === 'pro' ? feature.pro : feature.enterprise;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="w-8 h-8 text-emerald-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Subscribe to {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
                </h1>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
              )}

              <div className="mb-8">
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${SUBSCRIPTION_PRICES[plan]}
                  </span>
                  <span className="text-gray-600 ml-1">/month</span>
                </div>

                <div className="space-y-4 mb-8">
                  {planFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature.title}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Subscription includes:</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Monthly billing</li>
                    <li>• Cancel anytime</li>
                    <li>• 14-day money-back guarantee</li>
                    <li>• Instant access to all features</li>
                  </ul>
                </div>

                <button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Subscribe Now'
                  )}
                </button>
              </div>

              <p className="text-sm text-gray-500 text-center">
                By subscribing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}