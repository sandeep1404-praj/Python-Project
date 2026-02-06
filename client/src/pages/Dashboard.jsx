import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { itemService } from '../services/itemService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { FaBoxOpen, FaPlus, FaFilter, FaRedo, FaSearch } from 'react-icons/fa';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, statusFilter, categoryFilter]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await itemService.getItems();
      setItems(Array.isArray(data) ? data : []);
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

    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
  };

  const categories = [...new Set(items.map(item => item.category))];
  const statuses = [...new Set(items.map(item => item.status))];

  return (
    <div className="page-container py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-[#2f3b2b] mb-4 flex items-center gap-4">
              <FaBoxOpen className="text-[#3a5333]" /> Central Inventory
            </h1>
            <p className="text-[#56624e] text-lg leading-relaxed">Oversee and manage the collective resources of our shared library community.</p>
          </motion.div>
          
          <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/profile" className="btn btn-primary px-8 py-3.5 flex items-center gap-3 shadow-xl hover:shadow-[#3a5333]/30">
              <FaPlus /> Contribute New Item
            </Link>
          </motion.div>
        </div>

        {error && <div className="error-message mb-8">{error}</div>}

        {/* Filters */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8 mb-12 flex flex-col md:flex-row gap-8 items-end bg-white/60 backdrop-blur-md border border-[#f0ebe0]"
        >
          <div className="form-group mb-0 flex-1">
            <label className="form-label text-[10px] uppercase tracking-widest text-[#8a997d]">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-base"
            >
              <option value="">All Lifecycle Stages</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="form-group mb-0 flex-1">
            <label className="form-label text-[10px] uppercase tracking-widest text-[#8a997d]">Filter by Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-base"
            >
              <option value="">All Collections</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setStatusFilter('');
              setCategoryFilter('');
            }}
            className="btn btn-secondary py-3 px-6 h-[42px] flex items-center gap-2"
          >
            <FaRedo className="text-xs" /> Reset
          </button>
        </motion.div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32">
             <div className="w-12 h-12 border-4 border-[#3a5333] border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-[#56624e] font-medium animate-pulse">Synchronizing inventory...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="card py-32 text-center border-dashed border-2">
            <div className="bg-[#fbf7ee] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <FaSearch className="text-[#d9e2c6] text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-[#2f3b2b] mb-2">No matching items</h3>
            <p className="text-[#56624e]">We couldn't find any resources that match your current selection.</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredItems.map((item, index) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                  <Link to={`/item/${item.id}`} className="block h-full group">
                    <div className="card h-full flex flex-col overflow-hidden border border-[#f0ebe0] group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1">
                      <div className="h-48 bg-gradient-to-br from-[#fbf7ee] to-[#f3e6c5] flex items-center justify-center relative">
                        <FaBoxOpen className="text-6xl text-[#d9e2c6]/60 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-4 left-4">
                           <span className="text-[10px] font-black uppercase tracking-widest text-[#3a5333] bg-white/90 px-3 py-1 rounded-full shadow-sm">{item.category}</span>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="mb-4">
                           <span className={`status-badge ${
                                item.status === 'APPROVED' ? 'status-badge-available' : 
                                item.status === 'PENDING' ? 'status-badge-pending' : 'status-badge-borrowed'
                           }`}>
                            {item.status}
                           </span>
                        </div>
                        <h3 className="text-lg font-display font-bold text-[#2f3b2b] mb-2 group-hover:text-[#3a5333] transition-colors">{item.name}</h3>
                        <p className="text-[#56624e] text-sm mb-6 line-clamp-2 flex-1 italic">"{item.description}"</p>
                        
                        <div className="pt-4 border-t border-[#fbf7ee] flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-[#fbf7ee] flex items-center justify-center text-[#3a5333] text-[10px] font-bold border border-[#d9e2c6]">
                               {item.owner_username?.charAt(0).toUpperCase() || '?'}
                             </div>
                             <span className="text-xs font-bold text-[#2f3b2b]">{item.owner_username}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
