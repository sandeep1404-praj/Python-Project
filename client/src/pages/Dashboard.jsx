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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaBoxOpen className="text-blue-600" /> Items Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Manage and view all available items</p>
          </motion.div>
          
          <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/profile" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md font-medium">
              <FaPlus /> Add New Item (in Profile)
            </Link>
          </motion.div>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 shadow-sm border border-red-100">{error}</div>}

        {/* Filters */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4 items-center border border-gray-100"
        >
          <div className="flex items-center gap-2 text-gray-500 font-medium">
             <FaFilter /> Filters:
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setStatusFilter('');
              setCategoryFilter('');
            }}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition px-4 py-2"
          >
            <FaRedo className="text-sm" /> Clear
          </button>
        </motion.div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-gray-300 text-3xl" />
            </div>
            <p className="text-gray-600 text-lg font-medium">No items found</p>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredItems.map((item, index) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                  <Link to={`/item/${item.id}`} className="block h-full">
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1 h-full flex flex-col">
                      <div className="h-40 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <FaBoxOpen className="text-5xl text-blue-300/80" />
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                           <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{item.category}</span>
                           <span className={`text-xs px-2 py-1 rounded font-medium ${
                                item.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                           }`}>
                            {item.status}
                           </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{item.name}</h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{item.description}</p>
                        
                        <div className="pt-3 border-t border-gray-100 text-xs text-gray-400">
                           Owner: <span className="text-gray-600 font-medium">{item.owner_username}</span>
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
