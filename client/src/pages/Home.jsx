import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { 
  FaBoxOpen, 
  FaCheckCircle, 
  FaSearch, 
  FaStar, 
  FaExchangeAlt, 
  FaHandshake, 
  FaCoins, 
  FaUsers, 
  FaArrowRight, 
  FaMapMarkerAlt, 
  FaSignInAlt,
  FaUserPlus
} from 'react-icons/fa';

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, token } = useAuth();

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
      console.log('Unable to load items:', err);
      setFeaturedItems([]);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white pt-24 pb-32">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              Welcome to <span className="text-blue-200">Library Manager</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 font-light">
              Share, Borrow, Exchange, and Sell Items in Your Community.
            </p>
            <p className="text-lg text-blue-200 mb-12 max-w-2xl mx-auto">
              {!token 
                ? 'Join our growing community today. Browse items freely, or sign up to start trading.' 
                : `Welcome back, ${user?.username || 'Member'}! Ready to find something new?`}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/products')}
                className="bg-white text-blue-700 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all transform hover:-translate-y-1 flex items-center gap-2"
              >
                <FaSearch /> Browse Products
              </button>
              
              {token && user?.role === 'CUSTOMER' && (
                <button
                  onClick={() => navigate('/profile')}
                  className="bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:bg-green-600 transition-all transform hover:-translate-y-1 flex items-center gap-2"
                >
                  <FaBoxOpen /> Add Your Item
                </button>
              )}
              
              {!token && (
                <button
                  onClick={() => navigate('/register')}
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <FaUserPlus /> Join Now
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-12 -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-4"
            >
              <FaBoxOpen className="text-4xl text-blue-500 mx-auto mb-4" />
              <p className="text-gray-500 font-medium mb-1">Products Available</p>
              <p className="text-3xl font-bold text-gray-800">{featuredItems.length > 0 ? featuredItems.length + '+' : 'Growing'}</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-4"
            >
              <FaCoins className="text-4xl text-yellow-500 mx-auto mb-4" />
              <p className="text-gray-500 font-medium mb-1">Share & Earn</p>
              <p className="text-lg text-gray-800 font-bold">Earn Points & Rewards</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-4"
            >
              <FaUsers className="text-4xl text-purple-500 mx-auto mb-4" />
              <p className="text-gray-500 font-medium mb-1">Community First</p>
              <p className="text-lg text-gray-800 font-bold">Safe & Verified Members</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Getting started is simple. Join our platform to start sharing and borrowing today.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: FaBoxOpen, title: "List Item", desc: "Add items you want to sell, exchange, or share.", color: "text-blue-500" },
              { icon: FaCheckCircle, title: "Staff Review", desc: "Our team reviews items for quality assurance.", color: "text-green-500" },
              { icon: FaSearch, title: "Browse & Connect", desc: "Find items and connect with local members.", color: "text-purple-500" },
              { icon: FaStar, title: "Earn Points", desc: "Complete transactions and build your reputation.", color: "text-yellow-500" },
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center group p-6 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className={`text-5xl mb-6 ${feature.color} transform group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Items Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured Items</h2>
              <p className="text-gray-600 mt-2">Recently added items in your community</p>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="hidden md:flex items-center text-blue-600 font-semibold hover:text-blue-800 transition group"
            >
              View All <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : featuredItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-sm p-12 text-center"
            >
              <div className="bg-gray-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <FaBoxOpen className="text-gray-400 text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Items Yet</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">Be the first to list an item and start earning community points!</p>
              {token && user?.role === 'CUSTOMER' && (
                <button
                  onClick={() => navigate('/profile')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium inline-flex items-center gap-2"
                >
                  <FaUserPlus /> List an Item
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredItems.map((item) => (
                <motion.div 
                  key={item.id} 
                  variants={fadeInUp}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
                  onClick={() => handleItemClick(item.id)}
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-blue-400 to-indigo-500 h-48 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="text-white text-center transform group-hover:scale-110 transition-transform duration-300">
                      <FaBoxOpen className="text-5xl mb-2 mx-auto drop-shadow-md" />
                      <p className="font-bold text-lg drop-shadow-md">{item.category}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.ownership_type === 'SELL' ? 'bg-blue-100 text-blue-800' :
                        item.ownership_type === 'EXCHANGE' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                         {item.ownership_type === 'SELL' && <FaCoins className="mr-1" />}
                         {item.ownership_type === 'EXCHANGE' && <FaExchangeAlt className="mr-1" />}
                         {item.ownership_type === 'SHARE' && <FaHandshake className="mr-1" />}
                        {item.ownership_type}
                      </span>
                      {item.condition_score && (
                        <div className="flex items-center text-yellow-500">
                           <FaStar /> <span className="ml-1 text-sm font-bold text-gray-700">{item.condition_score}</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">{item.description}</p>
                    
                    <div className="flex items-center text-gray-500 text-xs pt-4 border-t border-gray-100">
                      <FaUsers className="mr-1.5" /> 
                      <span className="truncate max-w-[100px]">{item.owner.username}</span>
                      <span className="mx-2">•</span>
                      <FaMapMarkerAlt className="mr-1.5" />
                      <span className="truncate">{item.owner.location || 'N/A'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="mt-12 text-center md:hidden">
            <button
              onClick={() => navigate('/products')}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition w-full"
            >
              View All Products
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 opacity-20 transform -skew-y-6 scale-150 origin-bottom-left"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl text-blue-100 mb-10">
            Start sharing, borrowing, and earning points today. Verification takes just a few minutes.
          </p>
          {!token && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-blue-900 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition shadow-lg flex items-center justify-center gap-2"
              >
                <FaUserPlus /> Sign Up Now
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-transparent border-2 border-blue-200 text-blue-100 px-8 py-3 rounded-lg font-bold hover:bg-blue-800/50 hover:text-white transition flex items-center justify-center gap-2"
              >
                <FaSignInAlt /> Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

