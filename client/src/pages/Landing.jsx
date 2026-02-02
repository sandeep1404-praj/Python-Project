import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService.js';

export default function Landing() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      {/* Navigation Bar for non-authenticated users */}
      <nav className="sticky top-0 z-50 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-3xl">📚</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Library Manager
              </span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/login')}
                className="text-gray-700 hover:text-purple-600 font-medium transition px-6 py-2 rounded"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Welcome to Library Manager</h1>
          <p className="text-xl text-blue-100 mb-8">
            Share, Borrow, and Exchange Items in Your Community
          </p>
          <p className="text-lg text-blue-50 mb-8">
            Join thousands of people sharing resources locally. Find what you need, share what you have.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/browse')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Browse Products
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition border-2 border-white"
            >
              Start Sharing
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          Why Join Our Community?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Discover Items</h3>
            <p className="text-gray-600">Browse thousands of items available from members in your area. Find exactly what you need.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Share & Save</h3>
            <p className="text-gray-600">Share what you don't use, save money on what you need. Build a stronger community together.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Connect</h3>
            <p className="text-gray-600">Message with community members, negotiate terms, and make deals that work for everyone.</p>
          </div>
        </div>

        {/* Featured Items Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Featured Items</h2>
            <button
              onClick={() => navigate('/browse')}
              className="text-blue-600 hover:text-blue-700 font-semibold transition"
            >
              View All →
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-600">Loading featured items...</div>
            </div>
          ) : featuredItems.length === 0 ? (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">No items available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer"
                  onClick={() => navigate('/browse')}>
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
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded">
                        {item.ownership_type}
                      </span>
                      {item.condition_score && (
                        <span className="text-yellow-500">
                          {'⭐'.repeat(item.condition_score)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Owner: {item.owner.username}
                    </div>
                    {item.owner.location && (
                      <div className="text-xs text-blue-600 mt-1">
                        📍 {item.owner.location}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{featuredItems.length}+</div>
            <p className="text-gray-600">Items Available</p>
          </div>
          <div className="bg-green-50 rounded-lg p-8 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">💡</div>
            <p className="text-gray-600">Share Resources Locally</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-8 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">🌍</div>
            <p className="text-gray-600">Community Driven</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Create your account and start sharing with your community today!
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Create Account
            </button>
            <button
              onClick={() => navigate('/login')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 Library Manager. Sharing is caring. Built for communities.
          </p>
        </div>
      </footer>
    </div>
  );
}
