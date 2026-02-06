import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { FaBox, FaMapMarkerAlt, FaStar } from 'react-icons/fa';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_ORIGIN}${imagePath}`;
};

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
    navigate('/messages', { state: { recipientId: item.owner.id, itemName: item.name } });
  };

  return (
    <div className="page-container pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[#2f3b2b] mb-4">Discover Treasures</h1>
          <p className="text-[#56624e] text-lg">Find pre-loved items shared by your community</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Filters */}
        <div className="card p-8 mb-12 bg-white/80 backdrop-blur-md border border-[#f0ebe0]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Search */}
            <div className="form-group mb-0">
              <label className="form-label text-[10px] uppercase tracking-widest text-[#8a997d]">Keyword Search</label>
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-base"
              />
            </div>

            {/* Category Filter */}
            <div className="form-group mb-0">
              <label className="form-label text-[10px] uppercase tracking-widest text-[#8a997d]">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-base"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="form-group mb-0">
              <label className="form-label text-[10px] uppercase tracking-widest text-[#8a997d]">Local Area</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="input-base"
              >
                <option value="">Everywhere</option>
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
                className="btn btn-secondary w-full py-3 h-[42px] flex items-center justify-center gap-2"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-[#3a5333] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#56624e] font-medium animate-pulse">Scanning community inventory...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="card py-24 text-center border-dashed border-2">
            <div className="text-6xl text-[#d9e2c6] mb-6 flex justify-center"><FaBox /></div>
            <h3 className="text-xl font-bold text-[#2f3b2b] mb-2">No items match your search</h3>
            <p className="text-[#56624e] mb-8">Try adjusting your filters or search keywords</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('');
                setLocationFilter('');
              }}
              className="btn btn-primary px-8"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8 flex justify-between items-center px-2">
              <div className="text-xs font-black uppercase tracking-widest text-[#8a997d]">
                Found {filteredItems.length} Available Item{filteredItems.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/item/${item.id}`)}
                  className="card group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden border border-[#f0ebe0]"
                >
                  <div className="aspect-[4/3] relative">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#fbf7ee] to-[#f3e6c5] flex flex-col items-center justify-center">
                        <FaBox className="text-5xl text-[#d9e2c6]" />
                        <span className="mt-2 text-[10px] font-black uppercase text-[#8a997d] tracking-widest">{item.category}</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="status-badge status-badge-available shadow-lg">
                        {item.ownership_type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-display font-bold text-[#2f3b2b] group-hover:text-[#3a5333] transition-colors">{item.name}</h3>
                      {item.condition_score && (
                        <div className="flex gap-0.5 text-amber-500 text-[10px]">
                           {[...Array(item.condition_score)].map((_, i) => <FaStar key={i} />)}
                        </div>
                      )}
                    </div>
                    <p className="text-[#56624e] text-sm leading-relaxed line-clamp-2 h-10 mb-6 italic">"{item.description}"</p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-[#fbf7ee]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#fbf7ee] flex items-center justify-center text-[#3a5333] border border-[#d9e2c6] shadow-inner text-xs font-bold font-display">
                          {item.owner.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] font-black uppercase text-[#8a997d] leading-none mb-0.5">Owner</p>
                          <p className="text-xs font-bold text-[#2f3b2b] leading-none">{item.owner.username}</p>
                        </div>
                      </div>
                      
                      {item.owner.location && (
                        <div className="flex items-center gap-1 text-[#56624e] text-xs font-medium bg-[#fbf7ee] px-3 py-1.5 rounded-full border border-[#f0ebe0]">
                          <FaMapMarkerAlt className="text-[#3a5333]" size={10} />
                          {item.owner.location}
                        </div>
                      )}
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
