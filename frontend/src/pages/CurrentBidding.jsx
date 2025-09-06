import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import BidModal from '../components/BidModal';
import { Clock, DollarSign, User, Gavel, AlertCircle } from 'lucide-react';

const CurrentBidding = () => {
  const [currentBidding, setCurrentBidding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBidModal, setShowBidModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCurrentBidding();
    // Auto-refresh every 5 seconds for real-time updates
    const interval = setInterval(fetchCurrentBidding, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchCurrentBidding = async (showLoader = false) => {
    if (showLoader) setRefreshing(true);
    
    try {
      const response = await api.get('/bidding/current');
      setCurrentBidding(response.data);
    } catch (error) {
      console.error('Failed to fetch current bidding:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePlaceBid = async (bidAmount) => {
    try {
      await api.post('/bids', {
        product_id: currentBidding.product.id,
        bid_amount: bidAmount
      });
      
      // Refresh current bidding data
      await fetchCurrentBidding();
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to place bid');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!currentBidding?.product) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-md p-12">
          <div className="text-gray-400 mb-6">
            <Gavel className="h-24 w-24 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Live Bidding</h2>
          <p className="text-gray-600 mb-6">
            There are currently no products available for bidding. Check back later or browse the catalog to mark your interests.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-center text-blue-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">
                Tip: Mark interest on products to be notified when bidding starts!
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { product, topBid } = currentBidding;
  const currentHighest = topBid ? topBid.bid_amount : product.base_price;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with live indicator */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></span>
            <h1 className="text-3xl font-bold text-gray-900">Live Bidding</h1>
          </div>
          {refreshing && (
            <div className="text-sm text-gray-500 flex items-center">
              <div className="spinner mr-2" style={{width: '16px', height: '16px'}}></div>
              Updating...
            </div>
          )}
        </div>
        <p className="text-gray-600">Current auction - place your bid now!</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>

          {/* Bidding Information */}
          <div className="md:w-1/2 p-6">
            <div className="h-full flex flex-col">
              {/* Product Details */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Bidding Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-5 w-5 mr-2" />
                    <span>Starting Price</span>
                  </div>
                  <span className="font-semibold">${product.base_price}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                  <div className="flex items-center text-primary-700">
                    <Gavel className="h-5 w-5 mr-2" />
                    <span>Current Highest</span>
                  </div>
                  <span className="text-xl font-bold text-primary-700">
                    ${currentHighest}
                  </span>
                </div>

                {topBid && (
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center text-green-700">
                      <User className="h-5 w-5 mr-2" />
                      <span>Leading Bidder</span>
                    </div>
                    <span className="font-semibold text-green-700">
                      {topBid.users.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Bid Actions */}
              <div className="mt-auto space-y-4">
                <button
                  onClick={() => setShowBidModal(true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors btn-hover-scale flex items-center justify-center space-x-2"
                >
                  <Gavel className="h-5 w-5" />
                  <span>Place Bid</span>
                </button>
                
                <button
                  onClick={() => fetchCurrentBidding(true)}
                  disabled={refreshing}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Clock className="h-4 w-4" />
                  <span>{refreshing ? 'Refreshing...' : 'Refresh Bids'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bidding Tips */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Bidding Tips</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Bids automatically refresh every 5 seconds</li>
          <li>• Your bid must be higher than the current highest bid</li>
          <li>• The auction continues until the admin ends the bidding</li>
          <li>• Highest bidder when auction ends wins the item</li>
        </ul>
      </div>

      {/* Bid Modal */}
      <BidModal
        isOpen={showBidModal}
        onClose={() => setShowBidModal(false)}
        product={product}
        currentHighest={currentHighest}
        onPlaceBid={handlePlaceBid}
      />
    </div>
  );
};

export default CurrentBidding;