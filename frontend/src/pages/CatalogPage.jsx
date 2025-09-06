import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Search, Filter } from 'lucide-react';

const CatalogPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInterestMark = () => {
    // Optionally refresh products or show success message
    console.log('Interest marked successfully');
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {user?.role === 'admin' ? 'Product Catalog' : 'Antique Catalog'}
        </h1>
        <p className="text-gray-600">
          {user?.role === 'admin' 
            ? 'Manage your antique products and view interest levels'
            : 'Discover and mark your interest in unique antique pieces'
          }
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search antiques..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="listed">Listed</option>
            <option value="bidding">Live Bidding</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'No products available at the moment'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onInterestMark={handleInterestMark}
              isAdmin={user?.role === 'admin'}
            />
          ))}
        </div>
      )}

      {/* Stats Summary */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Catalog Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {products.filter(p => p.status === 'listed').length}
            </div>
            <div className="text-sm text-gray-600">Listed Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {products.filter(p => p.status === 'bidding').length}
            </div>
            <div className="text-sm text-gray-600">Live Bidding</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {products.length}
            </div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;