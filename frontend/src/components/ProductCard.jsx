import React, { useState } from 'react';
import { Heart, DollarSign, Clock, Users } from 'lucide-react';
import { api } from '../utils/api';

const ProductCard = ({ product, showInterests = false, interestCount = 0, onInterestMark, isAdmin = false }) => {
  const [isMarking, setIsMarking] = useState(false);

  const handleMarkInterest = async () => {
    if (isMarking) return;
    
    setIsMarking(true);
    try {
      await api.post('/interests', { product_id: product.id });
      if (onInterestMark) {
        onInterestMark(product.id);
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to mark interest');
    } finally {
      setIsMarking(false);
    }
  };

  const getStatusBadge = () => {
    const statusConfig = {
      listed: { color: 'bg-blue-100 text-blue-800', text: 'Listed' },
      bidding: { color: 'bg-red-100 text-red-800', text: 'Live Bidding' },
      sold: { color: 'bg-gray-100 text-gray-800', text: 'Sold' }
    };
    
    const config = statusConfig[product.status] || statusConfig.listed;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {product.status === 'bidding' && <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>}
        {config.text}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 left-2">
          {getStatusBadge()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Price and Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-primary-600">
            <DollarSign className="h-4 w-4 mr-1" />
            <span className="font-semibold">₹{product.base_price}</span>
            <span className="text-xs text-gray-500 ml-1">Base</span>
          </div>
          
          {showInterests && (
            <div className="flex items-center text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm">{interestCount} Interested</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isAdmin && product.status === 'listed' && (
          <button
            onClick={handleMarkInterest}
            disabled={isMarking}
            className="w-full flex items-center justify-center space-x-2 bg-primary-50 hover:bg-primary-100 text-primary-700 px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed btn-hover-scale"
          >
            <Heart className="h-4 w-4" />
            <span>{isMarking ? 'Marking...' : 'Mark Interest'}</span>
          </button>
        )}

        {product.status === 'bidding' && (
          <div className="w-full bg-red-50 text-red-700 px-4 py-2 rounded-md text-center">
            <Clock className="h-4 w-4 inline mr-2" />
            <span className="font-medium">Live Bidding</span>
          </div>
        )}

        {product.status === 'sold' && (
          <div className="w-full bg-gray-100 text-gray-600 px-4 py-2 rounded-md text-center">
            <span className="font-medium">Sold</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;