import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadFeaturedItems();
  }, []);

  const loadFeaturedItems = async () => {
    try {
      setLoading(true);
      const data = await itemService.getItems();
      // Get approved items only and limit to 6 most recent
      const approved = data.filter(item => item.status === 'APPROVED').slice(0, 6);
      setFeaturedItems(approved);
      setError('');
    } catch (err) {
      setError('Failed to load featured items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Welcome to Library Manager</h1>
          <p className="text-xl text-blue-100 mb-8">Share, Borrow, Exchange, and Sell Items in Your Community</p>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => navigate('/public-browse')}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Browse All Products
            </button>
            {user?.role === 'CUSTOMER' && (
              <button
                onClick={() => navigate('/create-item')}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition border-2 border-white"
              >
                + Add Your Item
              </button>
            )}
            <button
              onClick={() => navigate('/about')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">List Item</h3>
              <p className="text-gray-600 text-sm">Add items you want to sell, exchange, or share with the community</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Staff Review</h3>
              <p className="text-gray-600 text-sm">Our team reviews and approves items for quality and authenticity</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Browse & Connect</h3>
              <p className="text-gray-600 text-sm">Find items you need and connect with sellers or sharers</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Earn Points</h3>
              <p className="text-gray-600 text-sm">Earn points for transactions and redeem for rewards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Items Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Items</h2>
          <p className="text-gray-600">Recently approved items available in our community</p>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Loading featured items...</div>
          </div>
        ) : featuredItems.length === 0 ? (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">No items available yet</p>
            {user?.role === 'CUSTOMER' && (
              <button
                onClick={() => navigate('/create-item')}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Be the first to add an item
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer"
                onClick={() => navigate(`/item/${item.id}`)}>
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-40 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">📦</div>
                    <p className="text-sm font-semibold">{item.category}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded ${
                      item.ownership_type === 'SELL' ? 'bg-blue-100 text-blue-800' :
                      item.ownership_type === 'EXCHANGE' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.ownership_type === 'SELL' ? '💰 For Sale' :
                       item.ownership_type === 'EXCHANGE' ? '🔄 Exchange' :
                       '🤝 Share'}
                    </span>
                    {item.condition_score && (
                      <span className="text-yellow-500 text-sm">
                        {'⭐'.repeat(item.condition_score)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                    By: {item.owner.username} • {item.owner.location || 'Location not set'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/public-browse')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View All Products
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">📦</div>
              <p className="text-gray-600 font-semibold mb-1">Products Available</p>
              <p className="text-3xl font-bold text-gray-800">{featuredItems.length}+</p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <div className="text-4xl font-bold text-green-600 mb-2">💡</div>
              <p className="text-gray-600 font-semibold mb-1">Share & Earn</p>
              <p className="text-lg text-gray-800">Get points for every transaction</p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <div className="text-4xl font-bold text-purple-600 mb-2">🤝</div>
              <p className="text-gray-600 font-semibold mb-1">Community First</p>
              <p className="text-lg text-gray-800">Join thousands of users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call To Action Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="text-xl text-blue-100 mb-8">Start sharing, borrowing, and earning points today!</p>
          {!user && (
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Sign Up Now
              </button>
              <button
                onClick={() => navigate('/login')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
