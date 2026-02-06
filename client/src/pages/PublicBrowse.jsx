import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { itemService } from '../services/itemService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { FaSearch, FaFilter, FaBoxOpen, FaMapMarkerAlt, FaGlobeAmericas, FaStar, FaExchangeAlt, FaHandshake, FaCoins, FaComment, FaEnvelope, FaSpinner } from 'react-icons/fa';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_ORIGIN}${imagePath}`;
};

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
      navigate('/login', { state: { from: '/products', itemName: item.name } });
      return;
    }
    // If authenticated, go to messages
    navigate('/messages', { state: { recipientId: item.owner.id, itemName: item.name } });
  };

  return (
    <div className="page-container pb-20">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-[#3a5333] to-[#2f3b2b] text-white py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#d9e2c6]/10 rounded-full blur-2xl -ml-24 -mb-24"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tight">Public Archives</h1>
          <p className="text-[#d9e2c6] text-xl max-w-2xl font-medium italic opacity-90">"Witness the wealth of our shared community resources."</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {error && <div className="error-message mb-8">{error}</div>}

        {/* Filters */}
        <div className="card p-8 mb-12 bg-white/80 backdrop-blur-md border border-[#f0ebe0] -mt-20 relative z-20 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="form-group mb-0">
              <label className="form-label text-[10px] uppercase tracking-widest text-[#8a997d]">Keyword Search</label>
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-base bg-white"
              />
            </div>
            <div className="form-group mb-0">
              <label className="form-label text-[10px] uppercase tracking-widest text-[#8a997d]">Collection</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-base bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group mb-0">
              <label className="form-label text-[10px] uppercase tracking-widest text-[#8a997d]">Local Area</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="input-base bg-white"
              >
                <option value="">Everywhere</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedLocation('');
                }}
                className="btn btn-secondary w-full py-3 h-[42px] flex items-center justify-center gap-2 font-bold"
              >
                Reset Search
              </button>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-[#3a5333] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#56624e] font-medium animate-pulse">Consulting the community ledger...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="card py-32 text-center border-dashed border-2 bg-white/40">
            <div className="text-6xl mb-6 flex justify-center text-[#d9e2c6]"><FaSearch /></div>
            <h3 className="text-xl font-bold text-[#2f3b2b] mb-2">Nothing found in the archives</h3>
            <p className="text-[#56624e] mb-8">No results match your current investigation.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSelectedLocation('');
              }}
              className="text-[#3a5333] hover:underline font-black uppercase tracking-widest text-xs"
            >
              Clear all filters & start over
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8 flex justify-between items-center px-2">
               <div className="text-xs font-black uppercase tracking-widest text-[#8a997d]">
                  Indexing {filteredItems.length} Available Resource{filteredItems.length !== 1 ? 's' : ''}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/item/${item.id}`)}
                  className="card group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col border border-[#f0ebe0]"
                >
                  {/* Item Image */}
                  <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-[#fbf7ee] to-[#f3e6c5]">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <FaBoxOpen className="text-6xl text-[#d9e2c6]" />
                        <p className="mt-2 text-[10px] font-black uppercase text-[#8a997d] tracking-widest">No Visual Record</p>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="status-badge status-badge-available shadow-lg">
                        {item.ownership_type}
                      </span>
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                       <h3 className="text-xl font-display font-bold text-[#2f3b2b] group-hover:text-[#3a5333] transition-colors line-clamp-2">
                        {item.name}
                       </h3>
                    </div>
                    
                    <p className="text-[#56624e] text-sm mb-6 line-clamp-2 italic leading-relaxed flex-grow">
                      "{item.description}"
                    </p>

                    <div className="flex gap-2 mb-8">
                       <span className="text-[10px] font-black uppercase tracking-widest bg-[#fbf7ee] text-[#8a997d] px-3 py-1 rounded-full border border-[#f0ebe0]">
                         {item.category}
                       </span>
                    </div>

                    {/* Owner Info Bar */}
                    <div className="flex items-center justify-between pt-6 border-t border-[#fbf7ee] mb-8">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#fbf7ee] flex items-center justify-center text-[#3a5333] border border-[#d9e2c6] shadow-inner text-xs font-bold font-display">
                          {item.owner.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] font-black uppercase text-[#8a997d] leading-none mb-0.5">Steward</p>
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

                    {/* Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContactSeller(item);
                      }}
                      className="btn btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-3 shadow-xl hover:shadow-[#3a5333]/30"
                    >
                      {user ? <FaComment className="text-xs" /> : <FaEnvelope className="text-xs" />}
                      <span className="ml-2">{user ? 'Send Inquiry' : 'Log In to Inquire'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Results Summary */}
        {!loading && filteredItems.length > 0 && (
          <div className="mt-8 text-center text-[#8a997d]">
             <p className="text-[10px] font-black uppercase tracking-widest">Showing {filteredItems.length} of {items.length} records</p>
          </div>
        )}
      </div>
    </div>
  );
}
