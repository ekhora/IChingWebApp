import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import AuthModal from './components/AuthModal';
import DivinationPage from './components/DivinationPage';
import PredictPage from './components/PredictPage';
import HistoryPage from './components/HistoryPage';
import PremiumPage from './components/PremiumPage';
import SuccessPage from './components/SuccessPage';
import { useSubscription } from './hooks/useSubscription';
import { Sparkles, History, LogOut, Menu, X, Crown, Coins } from 'lucide-react';

type PageType = 'divination' | 'predict' | 'history' | 'premium' | 'success';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('divination');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isPremium } = useSubscription(user);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // Check for success page redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session_id')) {
      setCurrentPage('success');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentPage('divination');
    setMobileMenuOpen(false);
  };

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  const handleAuthSuccess = (isNewUser?: boolean) => {
    setShowAuthModal(false);
    // If it's a new user, automatically navigate to the divination page
    if (isNewUser) {
      setCurrentPage('divination');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your spiritual journey...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">I Ching Oracle</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover ancient wisdom through the I Ching. Consult the Book of Changes 
              for guidance on life's questions and preserve your spiritual journey.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Divine Guidance</h3>
                <p className="text-gray-600">Receive wisdom from the 64 hexagrams of the I Ching</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Personal Journey</h3>
                <p className="text-gray-600">Track your readings and spiritual growth over time</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 text-pink-600 font-bold text-lg">易</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Ancient Wisdom</h3>
                <p className="text-gray-600">5000 years of Chinese philosophy at your fingertips</p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg"
              >
                Begin Your Journey
              </button>
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">I Ching Oracle</h1>
              {isPremium && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  <Crown className="w-3 h-3" />
                  Premium
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => handlePageChange('divination')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentPage === 'divination' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Divination
              </button>
              <button
                onClick={() => handlePageChange('predict')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentPage === 'predict' 
                    ? 'bg-amber-500 text-white' 
                    : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                }`}
              >
                <Coins className="w-4 h-4" />
                Coin Oracle
              </button>
              <button
                onClick={() => handlePageChange('history')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentPage === 'history' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <History className="w-4 h-4" />
                History
              </button>
              <button
                onClick={() => handlePageChange('premium')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentPage === 'premium' 
                    ? 'bg-yellow-500 text-white' 
                    : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
                }`}
              >
                <Crown className="w-4 h-4" />
                Premium
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handlePageChange('divination')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                    currentPage === 'divination' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-600 hover:bg-blue-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Divination
                </button>
                <button
                  onClick={() => handlePageChange('predict')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                    currentPage === 'predict' 
                      ? 'bg-amber-500 text-white' 
                      : 'text-gray-600 hover:bg-amber-50'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  Coin Oracle
                </button>
                <button
                  onClick={() => handlePageChange('history')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                    currentPage === 'history' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-600 hover:bg-blue-50'
                  }`}
                >
                  <History className="w-4 h-4" />
                  History
                </button>
                <button
                  onClick={() => handlePageChange('premium')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                    currentPage === 'premium' 
                      ? 'bg-yellow-500 text-white' 
                      : 'text-gray-600 hover:bg-yellow-50'
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  Premium
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'divination' && <DivinationPage user={user} />}
        {currentPage === 'predict' && (
          <PredictPage 
            user={user} 
            onNavigateToHistory={() => handlePageChange('history')} 
          />
        )}
        {currentPage === 'history' && <HistoryPage user={user} />}
        {currentPage === 'premium' && <PremiumPage user={user} />}
        {currentPage === 'success' && <SuccessPage user={user} onNavigate={handlePageChange} />}
      </main>
    </div>
  );
}

export default App;