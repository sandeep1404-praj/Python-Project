import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Browse() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, searchQuery, categoryFilter, locationFilter]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await itemService.getItems();
      // Only show approved items to customers
      const approved = data.filter(item => item.status === 'APPROVED');
      setItems(approved);

      // Extract unique locations and categories
      const uniqueLocations = [...new Set(approved
        .filter(item => item.owner.location)
        .map(item => item.owner.location))];
      const uniqueCategories = [...new Set(approved.map(item => item.category))];

      setLocations(uniqueLocations.sort());
      setCategories(uniqueCategories.sort());
      setError('');
    } catch (err) {
      setError('Failed to load items');
      console.error(err);
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

    if (categoryFilter) {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    if (locationFilter) {
      filtered = filtered.filter(item => item.owner.location === locationFilter);
    }

    setFilteredItems(filtered);
  };

  const handleContactSeller = (item) => {
    navigate('/messages', { state: { itemId: item.id, recipientId: item.owner.id } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Browse Items</h1>
          <p className="text-gray-600">Find items available in your community</p>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('');
                  setLocationFilter('');
                }}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Loading items...</div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">No items found matching your filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('');
                setLocationFilter('');
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              Found {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-40 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-4xl mb-2">📦</div>
                      <p className="text-sm font-semibold">{item.category}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                    {/* Owner Info */}
                    <div className="bg-gray-50 rounded p-3 mb-3">
                      <p className="text-xs text-gray-500">Seller:</p>
                      <p className="font-semibold text-gray-800">{item.owner.username}</p>
                      <p className="text-xs text-gray-600">{item.owner.email}</p>
                      {item.owner.location && (
                        <p className="text-xs text-blue-600 mt-1">📍 {item.owner.location}</p>
                      )}
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded">
                        {item.ownership_type}
                      </span>
                      {item.condition_score && (
                        <span className="text-yellow-500 text-sm">
                          {'⭐'.repeat(item.condition_score)}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/item/${item.id}`)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleContactSeller(item)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm font-medium"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
