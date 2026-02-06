import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import pointsService from '../services/pointsService.js';
import { itemService } from '../services/itemService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaEdit, FaUser, FaKey, FaMapMarkerAlt, FaStar, FaChartLine, FaGift,
  FaCoins, FaExchangeAlt, FaHandshake, FaBox, FaTrash, FaClipboardList,
  FaCalendar, FaComment, FaPaperPlane, FaInbox, FaChartBar, FaImage,
  FaEnvelope, FaBoxOpen
} from 'react-icons/fa';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_ORIGIN}${imagePath}`;
};

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [myItems, setMyItems] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [myMessages, setMyMessages] = useState([]);
  const [userPoints, setUserPoints] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    location: ''
  });
  const [activeTab, setActiveTab] = useState('info');
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemFormData, setItemFormData] = useState({
    name: '',
    category: '',
    description: '',
    ownership_type: 'SELL',
  });
  const [itemImageFile, setItemImageFile] = useState(null);
  const { user } = useAuth();
  const isStaff = user?.role === 'STAFF';

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);

      // Get user profile
      const profileData = await api.get('/user/');
      setProfile(profileData.data);
      setFormData({ location: profileData.data.location || '' });

      // Get user's items
      const itemsData = await api.get('/items/');
      const userItems = itemsData.data.filter(item => item.owner.id === profileData.data.id);
      setMyItems(userItems);

      // Get user's borrow requests
      const requestsData = await api.get('/borrow-requests/');
      const userRequests = requestsData.data.filter(req => req.borrower.id === profileData.data.id);
      setMyRequests(userRequests);

      // Get user's messages
      const messagesData = await api.get('/messages/');
      setMyMessages(messagesData.data || []);

      // Get user's points
      const pointsData = await pointsService.getMyPoints();
      setUserPoints(pointsData);

      // Get point transactions
      const transactionsData = await pointsService.getMyTransactions();
      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);

      setError('');
    } catch (err) {
      setError('Failed to load profile data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (e) => {
    setFormData({
      ...formData,
      location: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/user/', {
        location: formData.location
      });
      setProfile(response.data);
      setFormData({ location: response.data.location || '' });
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    }
  };

  const handleItemFormChange = (e) => {
    setItemFormData({
      ...itemFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleItemFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setItemImageFile(file);
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('name', itemFormData.name.trim());
      payload.append('category', itemFormData.category.trim());
      payload.append('description', itemFormData.description.trim());
      payload.append('ownership_type', itemFormData.ownership_type);
      if (itemImageFile) {
        payload.append('image', itemImageFile);
      }

      await itemService.createItem(payload);
      setSuccess('Item created successfully! Awaiting staff approval.');
      setShowItemForm(false);
      setItemFormData({
        name: '',
        category: '',
        description: '',
        ownership_type: 'SELL',
      });
      setItemImageFile(null);
      await loadProfileData(); // Reload to show new item
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create item: ' + (err.message || 'Unknown error'));
      console.error(err);
    }
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('name', itemFormData.name.trim());
      payload.append('category', itemFormData.category.trim());
      payload.append('description', itemFormData.description.trim());
      payload.append('ownership_type', itemFormData.ownership_type);
      if (itemImageFile) {
        payload.append('image', itemImageFile);
      }

      await itemService.updateItem(editingItem.id, payload);
      setSuccess('Item updated successfully!');
      setEditingItem(null);
      setShowItemForm(false);
      setItemFormData({
        name: '',
        category: '',
        description: '',
        ownership_type: 'SELL',
      });
      setItemImageFile(null);
      await loadProfileData(); // Reload to show updated item
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update item: ' + (err.message || 'Unknown error'));
      console.error(err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    try {
      await itemService.deleteItem(itemId);
      setSuccess('Item deleted successfully!');
      await loadProfileData(); // Reload to reflect deletion
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete item: ' + (err.message || 'Unknown error'));
      console.error(err);
    }
  };

  const openEditItemForm = (item) => {
    setEditingItem(item);
    setItemFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      ownership_type: item.ownership_type,
    });
    setItemImageFile(null);
    setShowItemForm(true);
  };

  const cancelItemForm = () => {
    setShowItemForm(false);
    setEditingItem(null);
    setItemFormData({
      name: '',
      category: '',
      description: '',
      ownership_type: 'SELL',
    });
    setItemImageFile(null);
  };

  if (loading) {
    return (
      <div className="page-container flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#3a5333] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#56624e] font-medium animate-pulse">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page-container">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="card p-12 text-center">
            <p className="text-[#56624e] text-lg">Unable to load profile. Please try logging in again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container pb-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Premium Profile Header */}
        <div className="relative overflow-hidden bg-[#2f3b2b] text-[#f8f1da] rounded-3xl md:rounded-[2.5rem] shadow-2xl mb-12 border border-white/5">
          {/* Layered Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#3a5333] via-[#2f3b2b] to-[#1a2118] opacity-90"></div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#d9e2c6]/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#3a5333]/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          {/* Grain Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')]"></div>

          <div className="relative z-10 p-6 md:p-12">
            <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-10">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 w-full lg:max-w-[70%]">
                <div className="relative group shrink-0">
                  <div className="absolute inset-0 bg-[#d9e2c6] rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-3xl md:rounded-[2rem] bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl flex items-center justify-center border border-white/20 text-4xl md:text-5xl shadow-2xl overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-display font-black text-white/90 drop-shadow-lg">
                        {profile.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-2xl border-4 border-[#2f3b2b] flex items-center justify-center shadow-lg">
                    <div className="w-2 md:w-2.5 h-2 md:h-2.5 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="text-center md:text-left space-y-4 min-w-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9e2c6]"></span>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-[#d9e2c6]/90">
                      Member Level: {userPoints?.total_points > 100 ? 'Legend' : 'Pioneer'}
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-3xl xl:text-4xl font-display font-bold tracking-tight text-white leading-[1.1] truncate">
                    {profile.username}
                  </h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-6">
                    <p className="text-white/60 flex items-center gap-2 text-xs sm:text-sm font-medium">
                      <FaEnvelope className="text-[#d9e2c6]" /> {profile.email}
                    </p>
                    <p className="text-white/60 flex items-center gap-2 text-xs sm:text-sm font-medium">
                      <FaMapMarkerAlt className="text-[#d9e2c6]" /> {profile.location || 'Local Community'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto mt-4 lg:mt-2 shrink-0">
                {!editMode ? (
                  <>
                    <button
                      onClick={() => setEditMode(true)}
                      className="btn py-4 px-8 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 flex items-center justify-center gap-3 transition-all duration-300 ring-1 ring-white/10 rounded-2xl w-full sm:w-auto"
                    >
                      <FaEdit /> <span>Refine Profile</span>
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            {/* In-Header Stats Section */}
            <div className="mt-10 md:mt-14 pt-8 md:pt-10 border-t border-white/5">
              {editMode ? (
                <form onSubmit={handleUpdateProfile} className="max-w-xl bg-white/5 backdrop-blur-3xl p-6 md:p-8 rounded-[2rem] border border-white/10 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="form-group mb-0">
                      <label className="block text-[10px] font-black text-[#d9e2c6] mb-3 uppercase tracking-[0.2em]">Current Base</label>
                      <div className="relative group">
                         <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d9e2c6]/50 group-focus-within:text-[#d9e2c6] transition-colors" />
                         <input
                          type="text"
                          value={formData.location}
                          onChange={handleLocationChange}
                          placeholder="e.g., San Francisco, CA"
                          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#d9e2c6]/30 focus:border-[#d9e2c6]/30 transition-all font-medium"
                          autoFocus
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button type="submit" className="btn btn-secondary py-4 px-8 min-w-[160px] font-bold shadow-2xl shadow-[#d9e2c6]/10 w-full sm:w-auto">Commit Changes</button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setFormData({ location: profile.location || '' });
                      }}
                      className="btn py-4 px-8 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 w-full sm:w-auto"
                    >
                      Discard
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  <div className="group cursor-default p-4 rounded-3xl hover:bg-white/5 transition-colors">
                    <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-[#d9e2c6]/40 mb-2">Member Since</span>
                    <p className="text-lg md:text-xl font-display font-semibold text-white/90 flex items-center gap-3">
                      <FaCalendar className="text-[#d9e2c6] text-sm md:text-base" /> 2024
                    </p>
                  </div>
                  <div className="group cursor-default p-4 rounded-3xl hover:bg-white/5 transition-colors">
                    <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-[#d9e2c6]/40 mb-2">Inventory</span>
                    <p className="text-lg md:text-xl font-display font-semibold text-white/90 flex items-center gap-3">
                      <FaBoxOpen className="text-[#d9e2c6] text-sm md:text-base" /> {myItems.length} Treasures
                    </p>
                  </div>
                  <div className="group cursor-default p-4 rounded-3xl hover:bg-white/5 transition-colors">
                    <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-[#d9e2c6]/40 mb-2">Reputation</span>
                    <p className="text-lg md:text-xl font-display font-semibold text-white/90 flex items-center gap-3">
                      <FaStar className="text-amber-400 text-sm md:text-base" /> {userPoints?.total_points || 0} Points
                    </p>
                  </div>
                  <div className="group cursor-default p-4 rounded-3xl hover:bg-white/5 transition-colors">
                    <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-[#d9e2c6]/40 mb-2">Location</span>
                    <p className="text-lg md:text-xl font-display font-semibold text-white/90 flex items-center gap-3 truncate">
                      <FaMapMarkerAlt className="text-[#d9e2c6] text-sm md:text-base" /> {profile.location || 'Nomadic'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {userPoints && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="card p-6 border-l-4 border-amber-400 bg-amber-50/30">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-amber-700 mb-1">Reputation</p>
                  <p className="text-3xl font-display font-bold text-amber-800">{userPoints.total_points}</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-xl text-amber-600 shadow-inner">
                  <FaStar className="text-xl" />
                </div>
              </div>
              <p className="mt-4 text-xs text-amber-700 font-medium">Community Points</p>
            </div>

            <div className="card p-6 border-l-4 border-[#3a5333] bg-[#3a5333]/5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[#3a5333] mb-1">Impact</p>
                  <p className="text-3xl font-display font-bold text-[#2f3b2b]">{myItems.length}</p>
                </div>
                <div className="p-3 bg-[#d9e2c6] rounded-xl text-[#3a5333] shadow-inner">
                  <FaBox className="text-xl" />
                </div>
              </div>
              <p className="mt-4 text-xs text-[#56624e] font-medium">Items Shared</p>
            </div>

            <div className="card p-6 border-l-4 border-[#3a5333] bg-[#fbf7ee]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[#3a5333] mb-1">Activity</p>
                  <p className="text-3xl font-display font-bold text-[#2f3b2b]">{transactions.length}</p>
                </div>
                <div className="p-3 bg-[#d9e2c6] rounded-xl text-[#3a5333] shadow-inner">
                  <FaChartLine className="text-xl" />
                </div>
              </div>
              <p className="mt-4 text-xs text-[#56624e] font-medium">Total Interactions</p>
            </div>

            <div className="card p-8 bg-[#3a5333] text-[#f8f1da] flex flex-col justify-center items-center text-center">
              <FaGift className="text-3xl mb-3 text-[#d9e2c6]" />
              <button className="text-sm font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                Redeem Rewards
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-10 overflow-x-auto scrollbar-hide pb-2 border-b border-[#d9e2c6]">
          {[
            { id: 'info', label: 'My Gallery', count: myItems.length, icon: FaImage },
            { id: 'requests', label: 'Borrow Requests', count: myRequests.length, icon: FaClipboardList },
            { id: 'messages', label: 'Inbound Messages', count: myMessages.length, icon: FaInbox },
            { id: 'points', label: 'Point Ledger', count: transactions.length, icon: FaCoins }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-t-2xl font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-[#3a5333] shadow-sm ring-1 ring-[#d9e2c6] border-b-2 border-[#3a5333]'
                  : 'text-[#8a997d] hover:text-[#56624e] hover:bg-white/50'
              }`}
            >
              <tab.icon className={activeTab === tab.id ? 'text-[#3a5333]' : 'text-[#d9e2c6]'} />
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-[#3a5333] text-white' : 'bg-[#d9e2c6] text-[#3a5333]'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="animate-in fade-in duration-500">
          {activeTab === 'info' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-display font-bold text-[#2f3b2b]">My Shared Treasures</h2>
                  <p className="text-sm text-[#56624e]">Manage the items you've shared with the community</p>
                </div>
                {user?.role === 'CUSTOMER' && (
                  <button
                    onClick={() => setShowItemForm(true)}
                    className="btn btn-primary shadow-lg shadow-[#3a5333]/20 flex items-center gap-2"
                  >
                    + Add New Item
                  </button>
                )}
              </div>

              {/* Item Form overlay-like */}
              {showItemForm && (
                <div className="card p-8 md:p-10 border-2 border-[#3a5333]/20 bg-[#f8fcf5] animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-[#2f3b2b] flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#3a5333] text-white flex items-center justify-center">
                        {editingItem ? <FaEdit /> : <FaBox />}
                      </div>
                      {editingItem ? 'Edit Item Details' : 'What are you sharing?'}
                    </h3>
                    <button onClick={cancelItemForm} className="text-[#8a997d] hover:text-rose-600 transition-colors">
                      Cancel
                    </button>
                  </div>
                  
                  <form onSubmit={editingItem ? handleEditItem : handleCreateItem} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="form-group space-y-1">
                      <label className="form-label">Item Name</label>
                      <input
                        type="text"
                        name="name"
                        value={itemFormData.name}
                        onChange={handleItemFormChange}
                        className="input-base"
                        required
                      />
                    </div>
                    <div className="form-group space-y-1">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        name="category"
                        value={itemFormData.category}
                        onChange={handleItemFormChange}
                        className="input-base"
                        required
                      />
                    </div>
                    <div className="form-group md:col-span-2 space-y-1">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        value={itemFormData.description}
                        onChange={handleItemFormChange}
                        rows="3"
                        className="input-base"
                        required
                      />
                    </div>
                    <div className="form-group space-y-1">
                      <label className="form-label">Update Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleItemFileChange}
                        className="input-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#d9e2c6] file:text-[#3a5333] hover:file:bg-[#ccd9b6]"
                      />
                    </div>
                    <div className="form-group space-y-1">
                      <label className="form-label">Listing Type</label>
                      <select
                        name="ownership_type"
                        value={itemFormData.ownership_type}
                        onChange={handleItemFormChange}
                        className="input-base"
                        required
                      >
                        <option value="SELL">Sell (Permanent)</option>
                        <option value="EXCHANGE">Exchange (Trade)</option>
                        <option value="SHARE">Lend (Borrow)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 pt-4">
                      <button type="submit" className="btn btn-primary w-full md:w-auto px-12">
                        {editingItem ? 'Update Listing' : 'List Item Now'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Items List */}
              {myItems.length === 0 ? (
                <div className="card py-20 bg-white/50 border-dashed border-2 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-[#fbf7ee] rounded-full flex items-center justify-center text-[#d9e2c6] text-4xl mb-6 shadow-inner">
                    <FaBox />
                  </div>
                  <h3 className="text-xl font-bold text-[#2f3b2b] mb-2">No items listed yet</h3>
                  <p className="text-[#56624e] mb-8 max-w-xs">Start building your community reputation by sharing items you no longer need.</p>
                  {user?.role === 'CUSTOMER' && !showItemForm && (
                    <button onClick={() => setShowItemForm(true)} className="btn btn-primary">
                      Share Your First Item
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {myItems.map(item => (
                    <div key={item.id} className="card group hover:border-[#3a5333]/30 transition-all">
                      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                        {item.image ? (
                          <img 
                            src={getImageUrl(item.image)} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#d9e2c6] text-4xl bg-gradient-to-br from-gray-50 to-gray-100">
                            <FaBox />
                          </div>
                        )}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          <span className="status-badge status-badge-available shadow-sm backdrop-blur-md">
                            {item.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-display font-bold text-lg text-[#2f3b2b] group-hover:text-[#3a5333] transition-colors">{item.name}</h3>
                          <span className="text-[10px] font-black uppercase text-[#8a997d] bg-[#fbf7ee] px-2 py-1 rounded">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-sm text-[#56624e] line-clamp-2 mb-6 h-10">{item.description}</p>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-[#fbf7ee]">
                          <div className="flex items-center gap-2">
                            {item.ownership_type === 'SELL' ? (
                              <div className="w-8 h-8 rounded-full bg-[#fef3c7] text-[#92400e] flex items-center justify-center text-xs border border-[#fde68a]/50 shadow-sm"><FaCoins /></div>
                            ) : item.ownership_type === 'EXCHANGE' ? (
                              <div className="w-8 h-8 rounded-full bg-[#fbf7ee] text-[#3a5333] flex items-center justify-center text-xs border border-[#f0ebe0] shadow-sm"><FaExchangeAlt /></div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-[#f0f9f1] text-[#3a5333] flex items-center justify-center text-xs border border-[#d1e7d3]/50 shadow-sm"><FaHandshake /></div>
                            )}
                            <span className="text-[10px] font-black uppercase text-[#2f3b2b] tracking-widest">{item.ownership_type}</span>
                          </div>
                          
                          <div className="flex gap-1">
                            <button
                              onClick={() => openEditItemForm(item)}
                              className="p-2.5 rounded-xl bg-[#fbf7ee] text-[#56624e] hover:bg-[#3a5333] hover:text-white transition-all shadow-sm"
                              title="Edit"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-2.5 rounded-xl bg-[#fbf7ee] text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                              title="Delete"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-10 text-center">
                <h2 className="text-2xl font-display font-bold text-[#2f3b2b]">Borrow Requests</h2>
                <p className="text-[#56624e]">Track the status of items you've requested to borrow</p>
              </div>
              
              {myRequests.length === 0 ? (
                <div className="card py-16 text-center bg-white/50 border-dashed border-2">
                  <FaClipboardList className="mx-auto text-4xl text-[#d9e2c6] mb-4" />
                  <p className="text-[#56624e] font-medium">No active borrow requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myRequests.map(req => (
                    <div key={req.id} className="card p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center hover:bg-[#fbf7ee]/30 transition-colors">
                      <div className="w-20 h-20 bg-[#d9e2c6]/20 rounded-2xl flex-shrink-0 flex items-center justify-center text-[#3a5333] text-2xl">
                        <FaBox />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-[#2f3b2b]">{req.item.name}</h3>
                          <span className={`status-badge ${
                            req.status === 'APPROVED' ? 'status-badge-approved' :
                            req.status === 'DENIED' ? 'status-badge-denied' :
                            req.status === 'PENDING' ? 'status-badge-pending' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-[#56624e] text-sm mb-4">Owner: <span className="font-bold text-[#2f3b2b]">{req.item.owner.username}</span></p>
                        {req.due_date && (
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#3a5333]/5 text-[#3a5333] rounded-full text-xs font-bold uppercase tracking-widest">
                            <FaCalendar size={10} /> Due: {new Date(req.due_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 w-full md:w-auto">
                         <button onClick={() => navigate(`/items/${req.item.id}`)} className="btn btn-secondary text-xs py-2">View Item</button>
                         <button className="btn bg-white border border-[#d9e2c6] text-[#56624e] text-xs py-2 hover:bg-gray-50">Messenger</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-display font-bold text-[#2f3b2b]">Inbox</h2>
                <span className="text-xs font-bold uppercase tracking-widest text-[#8a997d]">{myMessages.length} Conversations</span>
              </div>

              {myMessages.length === 0 ? (
                <div className="card py-16 text-center bg-white/50 border-dashed border-2">
                  <FaComment className="mx-auto text-4xl text-[#d9e2c6] mb-4" />
                  <p className="text-[#56624e] font-medium">Your inbox is empty</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {myMessages.map(msg => (
                    <div key={msg.id} className={`card p-6 md:px-8 border-l-4 group cursor-pointer transition-all ${msg.is_read ? 'border-transparent bg-white shadow-sm' : 'border-[#3a5333] bg-[#f8fcf5] shadow-md'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${msg.sender.id === profile.id ? 'bg-[#8a997d]' : 'bg-[#3a5333]'}`}>
                            {msg.sender.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase text-[#8a997d] tracking-tighter mb-0.5">
                              {msg.sender.id === profile.id ? 'To' : 'From'}
                            </p>
                            <h4 className="font-bold text-[#2f3b2b]">
                              {msg.sender.id === profile.id ? msg.recipient.username : msg.sender.username}
                            </h4>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#8a997d]">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-md font-bold text-[#2f3b2b] mb-2">{msg.subject}</h3>
                      <p className="text-sm text-[#56624e] leading-relaxed line-clamp-2 mb-4 italic">"{msg.body}"</p>
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-xs font-bold text-[#3a5333] uppercase flex items-center gap-1">
                          Reply Now <FaPaperPlane size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'points' && (
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                  <h2 className="text-2xl font-display font-bold text-[#2f3b2b]">Community Credits</h2>
                  <p className="text-[#56624e]">History of your reputation points and contributions</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-[#3a5333] text-white rounded-2xl shadow-lg ring-4 ring-[#3a5333]/10">
                  <FaCoins className="text-amber-400" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-widest leading-none">Total Balance</span>
                    <span className="text-2xl font-bold leading-none">{userPoints.total_points}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="card py-16 text-center bg-white/50 border-dashed border-2">
                    <FaChartBar className="mx-auto text-4xl text-[#d9e2c6] mb-4" />
                    <p className="text-[#56624e] font-medium">No credits recorded yet</p>
                  </div>
                ) : (
                  transactions.map(transaction => (
                    <div key={transaction.id} className="card p-5 flex items-center justify-between group hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${transaction.points > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {transaction.points > 0 ? <FaChartLine /> : <FaExchangeAlt />}
                        </div>
                        <div>
                          <p className="font-bold text-[#2f3b2b] text-sm uppercase tracking-wide">{transaction.action}</p>
                          <p className="text-xs text-[#56624e] line-clamp-1">{transaction.description || 'System transaction'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-display font-bold ${transaction.points > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {transaction.points > 0 ? '+' : ''}{transaction.points}
                        </p>
                        <p className="text-[10px] font-bold text-[#8a997d] uppercase">{new Date(transaction.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Enhanced Redemption */}
              {userPoints.total_points > 0 && (
                <div className="mt-12 bg-gradient-to-br from-[#3a5333] to-[#5a6b4b] rounded-[32px] p-10 md:p-12 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 text-white/10 text-9xl">
                    <FaGift />
                  </div>
                  <div className="relative">
                    <h3 className="text-3xl font-display font-bold mb-4">Milestone Rewards</h3>
                    <p className="text-[#d9e2c6] mb-10 max-w-sm">Use your hard-earned points to unlock community perks and sustainability rewards.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { points: 50, label: 'Early Bird', perk: 'Free Listing' },
                        { points: 100, label: 'Neighborly', perk: 'Custom Badge' },
                        { points: 150, label: 'Eco-Warrior', perk: 'Tree Planting' },
                        { points: 500, label: 'Legend', perk: 'Premium Support' }
                      ].map(reward => (
                        <button 
                          key={reward.label}
                          disabled={userPoints.total_points < reward.points}
                          className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                            userPoints.total_points >= reward.points 
                              ? 'bg-white/10 border-white/20 hover:bg-white/20' 
                              : 'bg-black/10 border-transparent opacity-40 cursor-not-allowed'
                          }`}
                        >
                          <div className="text-left">
                            <span className="block text-[10px] font-bold uppercase tracking-widest text-[#d9e2c6]/60">{reward.label}</span>
                            <span className="block font-bold text-lg">{reward.perk}</span>
                          </div>
                          <div className="text-right font-display font-black text-xl">
                            {reward.points}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
