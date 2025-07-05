import React, { useEffect, useState } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { User } from '@supabase/supabase-js';
import { CheckCircle, Crown, ArrowRight } from 'lucide-react';

interface SuccessPageProps {
  user: User;
  onNavigate: (page: string) => void;
}

export default function SuccessPage({ user, onNavigate }: SuccessPageProps) {
  const { refetch } = useSubscription(user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Refetch subscription status after successful payment
    const timer = setTimeout(async () => {
      await refetch();
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [refetch]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Your Upgrade</h2>
        <p className="text-gray-600">Please wait while we activate your premium features...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Premium!</h2>
      <p className="text-gray-600 text-lg mb-8">
        Your payment was successful and your premium features are now active.
      </p>

      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 mb-8 border border-yellow-200">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="w-6 h-6 text-yellow-600" />
          <h3 className="text-xl font-semibold text-gray-800">Premium Features Unlocked</h3>
        </div>
        
        <ul className="text-left space-y-2 text-gray-700">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Unlimited divinations
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Enhanced interpretations
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Complete history access
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Priority support
          </li>
        </ul>
      </div>

      <button
        onClick={() => onNavigate('divination')}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all inline-flex items-center gap-2"
      >
        Start Your Premium Journey
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}