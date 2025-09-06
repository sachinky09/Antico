import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { 
  Plus, 
  Play, 
  Square, 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign,
  Eye,
  EyeOff 
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  const [interests, setInterests] = useState({});
  const [currentBidding, setCurrentBidding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    base_price: '',
    image_url: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, soldRes, biddingRes] = await Promise.all([
        api.get('/products'),
        api.get('/products/sold'),
        api.get('/bidding/current')
      ]);
      
      setProducts(productsRes.data);
      setSoldProducts(soldRes.data);
      setCurrentBidding(biddingRes.data);
      
      // Fetch interests for each product
      const interestPromises = productsRes.data.map(product => 
        api.get(`/products/${product.id}/interests`)
      );
      const interestResults = await Promise.all(interestPromises);
      
      const interestMap = {};
      interestResults.forEach((result) => {
        interestMap[result.data.product_id] = result.data.interest_count;
      });
      setInterests(interestMap);
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    try {
      await api.post('/products', {
        ...newProduct,
        base_price: parseFloat(newProduct.base_price)
      });
      
      setNewProduct({ name: '', description: '', base_price: '', image_url: '' });
      setShowAddForm(false);
      await fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add product');
    }
  };

  const handleStartBidding = async (productId) => {
    try {
      await api.post('/bidding/start', { product_id: productId });
      await fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to start bidding');
    }
  };

  const handleEndBidding = async (productId) => {
    try {
      await api.post('/bidding/end', { product_id: productId });
      await fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to end bidding');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  const stats = {
    totalProducts: products.length,
    listedProducts: products.filter(p => p.status === 'listed').length,
    currentBidding: products.filter(p => p.status === 'bidding').length,
    soldProducts: soldProducts.length,
    totalInterests: Object.values(interests).reduce((sum, count) => sum + count, 0)
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage products, bidding, and view analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Listed Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.listedProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Interests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInterests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Items Sold</p>
              <p className="text-2xl font-bold text-gray-900">{stats.soldProducts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Bidding Alert */}
      {currentBidding?.product && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></span>
              <div>
                <h3 className="font-medium text-red-900">
                  Live Bidding: {currentBidding.product.name}
                </h3>
                <p className="text-sm text-red-700">
                  Current highest bid: ${currentBidding.topBid?.bid_amount || currentBidding.product.base_price}
                  {currentBidding.topBid && ` by ${currentBidding.topBid.users.name}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleEndBidding(currentBidding.product.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              <Square className="h-4 w-4" />
              <span>End Bidding</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'products', label: 'Manage Products' },
          { id: 'sold', label: 'Sold Products' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          {/* Add Product Button */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Product Management</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors btn-hover-scale"
            >
              {showAddForm ? <EyeOff className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{showAddForm ? 'Hide Form' : 'Add Product'}</span>
            </button>
          </div>

          {/* Add Product Form */}
          {showAddForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Product</h3>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Base Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.base_price}
                      onChange={(e) => setNewProduct({ ...newProduct, base_price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe the antique item..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={newProduct.image_url}
                    onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors btn-hover-scale"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard
                  product={product}
                  showInterests={true}
                  interestCount={interests[product.id] || 0}
                  isAdmin={true}
                />
                
                {/* Admin Actions */}
                <div className="absolute top-2 right-2 flex space-x-1">
                  {product.status === 'listed' && (
                    <button
                      onClick={() => handleStartBidding(product.id)}
                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md shadow-lg transition-colors"
                      title="Start Bidding"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                  
                  {product.status === 'bidding' && (
                    <button
                      onClick={() => handleEndBidding(product.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md shadow-lg transition-colors"
                      title="End Bidding"
                    >
                      <Square className="h-4 w-4" />
                    </button>
                  )}
                  
                  <div className="bg-blue-600 text-white p-2 rounded-md shadow-lg">
                    <Eye className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sold Products Tab */}
      {activeTab === 'sold' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sold Products</h2>
          
          {soldProducts.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sold products yet</h3>
              <p className="text-gray-600">Products will appear here after successful auctions</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {soldProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Price:</span>
                        <span>${product.base_price}</span>
                      </div>
                      {product.winning_bid && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Winning Bid:</span>
                            <span className="font-semibold text-green-600">
                              ${product.winning_bid.bid_amount}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Winner:</span>
                            <span>{product.winning_bid.users.name}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;