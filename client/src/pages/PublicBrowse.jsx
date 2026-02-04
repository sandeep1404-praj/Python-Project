import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { itemService } from '../services/itemService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { FaSearch, FaFilter, FaBoxOpen, FaMapMarkerAlt, FaGlobeAmericas, FaStar, FaExchangeAlt, FaHandshake, FaCoins, FaComment, FaEnvelope, FaSpinner } from 'react-icons/fa';

export default function PublicBrowse() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await itemService.getItems();
      // Only show approved items to public users
      const approved = data.filter(item => item.status === 'APPROVED');
      setItems(approved);

      // Extract unique categories and locations
      const uniqueCategories = [...new Set(approved.map(item => item.category).filter(Boolean))];
      const uniqueLocations = [...new Set(approved
        .map(item => item.owner?.location)
        .filter(Boolean))];

      setCategories(uniqueCategories);
      setLocations(uniqueLocations);
      setFilteredItems(approved);
      setError('');
    } catch (err) {
      // Allow page to load even if items can't be fetched
      console.log('Unable to load products:', err);
      setItems([]);
      setFilteredItems([]);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = items;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedLocation) {
      filtered = filtered.filter(item => item.owner?.location === selectedLocation);
    }

    setFilteredItems(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCategory, selectedLocation, items]);

  const handleContactSeller = (item) => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: '/products', itemId: item.id } });
      return;
    }
    // If authenticated, go to messages
    navigate('/messages', { state: { recipientId: item.owner.id, itemId: item.id } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation for public users - Removed */}


      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Browse Products</h1>
          <p className="text-blue-100">Discover items available from community members</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Search</label>
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">&nbsp;</label>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedLocation('');
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4 text-blue-600 inline-block"><FaSpinner /></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-5xl mb-4 text-gray-400 flex justify-center"><FaSearch /></div>
            <p className="text-gray-600 mb-4">No items found matching your criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSelectedLocation('');
              }}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              View all items
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                {/* Item Image/Header */}
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-40 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-5xl text-white/80"><FaBoxOpen /></div>
                  </div>
                </div>

                {/* Item Details */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                  {/* Status badges */}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded">
                      {item.ownership_type}
                    </span>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded">
                      {item.category}
                    </span>
                  </div>

                  {/* Condition Rating */}
                  {item.condition_score && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-600">Condition:</span>
                      <span className="text-yellow-500 flex">
                        {[...Array(item.condition_score)].map((_, i) => <FaStar key={i} />)}
                      </span>
                    </div>
                  )}

                  {/* Owner Info */}
                  <div className="bg-gray-50 rounded p-3 mb-3 flex-grow">
                    <p className="text-xs text-gray-600 mb-2">
                      <span className="font-semibold">Owner:</span> {item.owner.username}
                    </p>
                    {item.owner.email && (
                      <p className="text-xs text-gray-600 mb-2">
                        <span className="font-semibold">Email:</span> {item.owner.email}
                      </p>
                    )}
                    {item.owner.location && (
                      <p className="text-xs text-blue-600 flex items-center">
                        <FaMapMarkerAlt className="mr-1" /> <span className="font-semibold mr-1">Location:</span> {item.owner.location}
                      </p>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleContactSeller(item)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold mt-auto flex items-center justify-center gap-2"
                  >
                    {user ? <><FaComment /> Contact Seller</> : <><FaEnvelope /> Login to Contact</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        {!loading && filteredItems.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            <p>Showing {filteredItems.length} of {items.length} items</p>
          </div>
        )}
      </div>
    </div>
  );
}
