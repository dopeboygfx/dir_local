import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Store, User, TrendingUp, Shield, BarChart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleCreateListing = () => {
    if (!isAuthenticated) {
      handleAuthClick('login');
    } else {
      navigate('/create-listing');
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
      setIsMenuOpen(false); // Close mobile menu if open
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-sm relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Store className="w-8 h-8 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">LocalBiz</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/top-businesses"
                className="text-gray-700 hover:text-emerald-600 transition-colors flex items-center"
              >
                <TrendingUp className="w-5 h-5 mr-1" />
                Top Businesses
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-emerald-600 transition-colors flex items-center"
                >
                  <Shield className="w-5 h-5 mr-1" />
                  Admin
                </Link>
              )}
              <button
                onClick={handleCreateListing}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
              >
                <Store className="w-5 h-5 mr-2" />
                List Your Business
              </button>
              
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors py-2">
                    <User className="w-5 h-5" />
                    <span>{user?.name}</span>
                  </button>
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/my-listings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Listings
                    </Link>
                    <Link
                      to="/analytics"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <BarChart className="w-4 h-4 mr-2" />
                        Analytics
                      </div>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <User className="w-5 h-5" />
                    <span>{user?.name}</span>
                  </div>
                  <button
                    onClick={handleCreateListing}
                    className="block w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    List Your Business
                  </button>
                  <Link
                    to="/profile"
                    className="block text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/my-listings"
                    className="block text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    My Listings
                  </Link>
                  <Link
                    to="/analytics"
                    className="block text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    Analytics
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="block w-full text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="block w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        mode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onModeChange={setAuthMode}
      />
    </>
  );
}