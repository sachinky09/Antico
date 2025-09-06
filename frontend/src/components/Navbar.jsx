import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { User, Gavel, Shield, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentBidding, setCurrentBidding] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCurrentBidding();
      // Poll every 30 seconds for current bidding updates
      const interval = setInterval(fetchCurrentBidding, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchCurrentBidding = async () => {
    try {
      const response = await api.get('/bidding/current');
      setCurrentBidding(response.data);
    } catch (error) {
      console.error('Failed to fetch current bidding:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg border-b-2 border-primary-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Gavel className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-800">Antico</span>
          </Link>

          {/* Current Bidding Alert (for users) */}
          {user.role === 'user' && currentBidding?.product && (
            <div className="hidden md:block">
              <Link 
                to="/bidding" 
                className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium pulse-animation hover:bg-red-200 transition-colors"
              >
                🔴 LIVE: {currentBidding.product.name}
                {currentBidding.topBid && (
                  <span className="ml-2">${currentBidding.topBid.bid_amount}</span>
                )}
              </Link>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              {user.role === 'user' && (
                <>
                  <Link
                    to="/"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/' 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-600 hover:text-primary-600'
                    }`}
                  >
                    Catalog
                  </Link>
                  <Link
                    to="/bidding"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/bidding' 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-600 hover:text-primary-600'
                    }`}
                  >
                    Current Bidding
                  </Link>
                </>
              )}
              
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/admin' 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  Admin Dashboard
                </Link>
              )}
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user.role === 'admin' ? (
                  <Shield className="h-5 w-5 text-primary-600" />
                ) : (
                  <User className="h-5 w-5 text-primary-600" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                </span>
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                  {user.role}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {/* Current Bidding Alert (mobile) */}
            {user.role === 'user' && currentBidding?.product && (
              <Link 
                to="/bidding" 
                className="block mb-4 bg-red-100 text-red-800 px-3 py-2 rounded text-sm font-medium pulse-animation"
                onClick={() => setIsMenuOpen(false)}
              >
                🔴 LIVE: {currentBidding.product.name}
                {currentBidding.topBid && (
                  <span className="ml-2">${currentBidding.topBid.bid_amount}</span>
                )}
              </Link>
            )}

            {/* Navigation Links */}
            <div className="space-y-2">
              {user.role === 'user' && (
                <>
                  <Link
                    to="/"
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Catalog
                  </Link>
                  <Link
                    to="/bidding"
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Current Bidding
                  </Link>
                </>
              )}
              
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="block px-3 py-2 rounded-md text-gray-600 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
            </div>

            {/* User Info & Logout */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 px-3 py-2">
                {user.role === 'admin' ? (
                  <Shield className="h-5 w-5 text-primary-600" />
                ) : (
                  <User className="h-5 w-5 text-primary-600" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                </span>
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 w-full text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;