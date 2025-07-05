import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useSubscription } from '../hooks/useSubscription';
import { stripe, PREMIUM_PRICE_ID } from '../lib/stripe';
import { supabase } from '../lib/supabase';
import { Crown, Sparkles, History, Star, Check, Loader } from 'lucide-react';

interface PremiumPageProps {
  user: User;
}

export default function PremiumPage({ user }: PremiumPageProps) {
  const { subscription, isPremium, loading } = useSubscription(user);
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    if (!PREMIUM_PRICE_ID) {
      alert('Premium pricing not configured. Please contact support.');
      return;
    }

    setUpgrading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: PREMIUM_PRICE_ID,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      const stripeInstance = await stripe;
      
      if (stripeInstance) {
        const { error } = await stripeInstance.redirectToCheckout({ sessionId });
        if (error) {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error upgrading to premium:', error);
      alert('Failed to start upgrade process. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading subscription details...</p>
      </div>
    );
  }

  if (isPremium) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Premium Member</h2>
          <p className="text-gray-600">You have access to all premium features</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Your Premium Benefits</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Unlimited Divinations</h4>
                <p className="text-gray-600 text-sm">Consult the I Ching as many times as you need</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Enhanced Interpretations</h4>
                <p className="text-gray-600 text-sm">Deeper insights and detailed guidance</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Complete History</h4>
                <p className="text-gray-600 text-sm">Access your entire divination journey</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Priority Support</h4>
                <p className="text-gray-600 text-sm">Get help when you need it most</p>
              </div>
            </div>
          </div>

          {subscription?.current_period_end && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                Your premium subscription renews on{' '}
                {new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6">
          <Crown className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Unlock Premium Wisdom</h2>
        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
          Enhance your spiritual journey with unlimited access to the I Ching's ancient wisdom
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Free</h3>
            <div className="text-3xl font-bold text-gray-800">$0</div>
            <p className="text-gray-600">Forever</p>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">3 divinations per day</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Basic interpretations</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">7-day history</span>
            </li>
          </ul>

          <button
            disabled
            className="w-full py-3 px-4 bg-gray-100 text-gray-500 rounded-lg font-medium cursor-not-allowed"
          >
            Current Plan
          </button>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-8 border-2 border-yellow-200 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Premium</h3>
            <div className="text-3xl font-bold text-gray-800">$9.99</div>
            <p className="text-gray-600">per month</p>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">Unlimited divinations</span>
            </li>
            <li className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">Enhanced interpretations</span>
            </li>
            <li className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">Complete history</span>
            </li>
            <li className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">Priority support</span>
            </li>
            <li className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">Advanced insights</span>
            </li>
          </ul>

          <button
            onClick={handleUpgrade}
            disabled={upgrading}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {upgrading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                Processing...
              </span>
            ) : (
              'Upgrade to Premium'
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Why Choose Premium?</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Unlimited Wisdom</h4>
            <p className="text-gray-600 text-sm">
              Consult the I Ching whenever you need guidance, without daily limits
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Complete Journey</h4>
            <p className="text-gray-600 text-sm">
              Track your entire spiritual journey with unlimited history access
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Enhanced Insights</h4>
            <p className="text-gray-600 text-sm">
              Receive deeper, more detailed interpretations for better understanding
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}