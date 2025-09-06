import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';

const BidModal = ({ isOpen, onClose, product, currentHighest, onPlaceBid }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !product) return null;

  const minBid = currentHighest ? parseFloat(currentHighest) + 1 : parseFloat(product.base_price) + 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(bidAmount);
    
    if (amount <= (currentHighest || product.base_price)) {
      alert(`Bid must be higher than $${currentHighest || product.base_price}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onPlaceBid(amount);
      setBidAmount('');
      onClose();
    } catch (error) {
      alert(error.message || 'Failed to place bid');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Place Your Bid</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
            <p className="text-sm text-gray-600">
              Current highest: ${currentHighest || product.base_price}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="bid-amount" className="block text-sm font-medium text-gray-700 mb-2">
                Your Bid Amount
              </label>
              <div className="relative">
                <DollarSign className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  id="bid-amount"
                  type="number"
                  min={minBid}
                  step="0.01"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder={`Min: ${minBid}`}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum bid: ${minBid}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed btn-hover-scale"
              >
                {isSubmitting ? 'Placing...' : 'Place Bid'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BidModal;