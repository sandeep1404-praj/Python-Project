import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import pointsService from '../services/pointsService.js';
import { itemService } from '../services/itemService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { FaEdit, FaUser, FaKey, FaMapMarkerAlt, FaStar, FaChartLine, FaGift, FaCoins, FaExchangeAlt, FaHandshake, FaBox, FaTrash, FaClipboardList, FaCalendar, FaComment, FaPaperPlane, FaInbox, FaChartBar } from 'react-icons/fa';
// Sidebar removed


export default function Profile() {
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
  const { user } = useAuth();

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

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      await itemService.createItem(itemFormData);
      setSuccess('Item created successfully! Awaiting staff approval.');
      setShowItemForm(false);
      setItemFormData({
        name: '',
        category: '',
        description: '',
        ownership_type: 'SELL',
      });
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
      await itemService.updateItem(editingItem.id, itemFormData);
      setSuccess('Item updated successfully!');
      setEditingItem(null);
      setShowItemForm(false);
      setItemFormData({
        name: '',
        category: '',
        description: '',
        ownership_type: 'SELL',
      });
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Unable to load profile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 w-full">

        <div className="max-w-6xl mx-auto px-4 py-8">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">{success}</div>}

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{profile.username}</h1>
              <p className="text-blue-100">{profile.email}</p>
            </div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition font-semibold flex items-center"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </button>
            )}
          </div>

          {editMode ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4 bg-blue-700 rounded-lg p-4">
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={handleLocationChange}
                  placeholder="e.g., New York, CA"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition font-semibold"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setFormData({ location: profile.location || '' });
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-blue-100 text-sm">Role</p>
                <p className="text-lg font-semibold flex items-center">{profile.role === 'CUSTOMER' ? <><FaUser className="mr-2" /> Customer</> : <><FaKey className="mr-2" /> Staff</>}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Location</p>
                <p className="text-lg font-semibold flex items-center">{profile.location ? <><FaMapMarkerAlt className="mr-2" /> {profile.location}</> : 'Not set'}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Member Since</p>
                <p className="text-lg font-semibold">2024</p>
              </div>
            </div>
          )}
        </div>

        {/* Points Card */}
        {userPoints && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-yellow-50 rounded-lg shadow-md p-6 border-l-4 border-yellow-400">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-yellow-700 font-semibold text-sm mb-1">Total Points</p>
                  <p className="text-4xl font-bold text-yellow-600">{userPoints.total_points}</p>
                </div>
                <div className="text-5xl text-yellow-500"><FaStar /></div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg shadow-md p-6 border-l-4 border-green-400">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-green-700 font-semibold text-sm mb-1">Transactions</p>
                  <p className="text-4xl font-bold text-green-600">{transactions.length}</p>
                </div>
                <div className="text-5xl text-green-500"><FaChartLine /></div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg shadow-md p-6 border-l-4 border-blue-400">
              <div>
                <p className="text-blue-700 font-semibold text-sm mb-3">Quick Actions</p>
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold text-sm flex items-center justify-center">
                  <FaGift className="mr-2" /> Redeem Points
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto border-b border-gray-200">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-6 py-3 font-medium transition border-b-2 whitespace-nowrap ${
              activeTab === 'info'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            My Items ({myItems.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 font-medium transition border-b-2 whitespace-nowrap ${
              activeTab === 'requests'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Requests ({myRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-3 font-medium transition border-b-2 whitespace-nowrap ${
              activeTab === 'messages'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Messages ({myMessages.length})
          </button>
          <button
            onClick={() => setActiveTab('points')}
            className={`px-6 py-3 font-medium transition border-b-2 whitespace-nowrap ${
              activeTab === 'points'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Points ({transactions.length})
          </button>
        </div>

        {/* My Items Tab */}
        {activeTab === 'info' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">My Listed Items</h2>
              {!showItemForm && user?.role === 'CUSTOMER' && (
                <button
                  onClick={() => setShowItemForm(true)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  + Add New Item
                </button>
              )}
            </div>

            {/* Item Form (Create/Edit) */}
            {showItemForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-blue-500">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </h3>
                <form onSubmit={editingItem ? handleEditItem : handleCreateItem} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={itemFormData.name}
                      onChange={handleItemFormChange}
                      placeholder="Enter item name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <input
                      type="text"
                      name="category"
                      value={itemFormData.category}
                      onChange={handleItemFormChange}
                      placeholder="e.g., Electronics, Books, Furniture"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      name="description"
                      value={itemFormData.description}
                      onChange={handleItemFormChange}
                      placeholder="Describe your item..."
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                    <select
                      name="ownership_type"
                      value={itemFormData.ownership_type}
                      onChange={handleItemFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="SELL">For Sale (Sell)</option>
                      <option value="EXCHANGE">Exchange</option>
                      <option value="SHARE">Share</option>
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      {editingItem ? 'Update Item' : 'Create Item'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelItemForm}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Items List */}
            {myItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-5xl mb-4 text-gray-300 flex justify-center"><FaBox /></div>
                <p className="text-gray-600 mb-4">You haven't added any items yet</p>
                {user?.role === 'CUSTOMER' && !showItemForm && (
                  <button
                    onClick={() => setShowItemForm(true)}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Add Your First Item →
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myItems.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Category:</span>
                        <p className="font-medium text-gray-800">{item.category}</p>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Type:</span>
                        <p className="font-medium flex items-center">{item.ownership_type === 'SELL' ? <><FaCoins className="mr-1 text-yellow-500" /> Sale</> : item.ownership_type === 'EXCHANGE' ? <><FaExchangeAlt className="mr-1 text-blue-500" /> Exchange</> : <><FaHandshake className="mr-1 text-green-500" /> Share</>}</p>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Status:</span>
                        <p className={`font-medium px-2 py-1 rounded text-xs ${
                          item.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          item.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status}
                        </p>
                      </div>
                      {item.condition_score && (
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Condition:</span>
                          <p className="font-medium text-yellow-500 flex">{[...Array(item.condition_score)].map((_, i) => <FaStar key={i} />)}</p>
                        </div>
                      )}
                    </div>
                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => openEditItemForm(item)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm flex items-center justify-center"
                      >
                        <FaEdit className="mr-2" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold text-sm flex items-center justify-center"
                      >
                        <FaTrash className="mr-2" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Borrow Requests</h2>
            {myRequests.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-5xl mb-4 text-gray-300 flex justify-center"><FaClipboardList /></div>
                <p className="text-gray-600">You haven't made any borrow requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myRequests.map(req => (
                  <div key={req.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{req.item.name}</h3>
                        <p className="text-sm text-gray-600">From: <strong>{req.item.owner.username}</strong></p>
                      </div>
                      <span className={`px-3 py-1 rounded text-sm font-medium ${
                        req.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        req.status === 'DENIED' ? 'bg-red-100 text-red-800' :
                        req.status === 'RETURNED' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{req.item.description}</p>
                    {req.due_date && (
                      <p className="text-sm text-gray-600 flex items-center">
                        <FaCalendar className="mr-1" /> Due: {new Date(req.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Messages</h2>
            {myMessages.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-5xl mb-4 text-gray-300 flex justify-center"><FaComment /></div>
                <p className="text-gray-600">You have no messages</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myMessages.map(msg => (
                  <div key={msg.id} className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${msg.is_read ? 'border-gray-300' : 'border-blue-500'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm text-gray-600 mb-1 flex items-center">
                          {msg.sender.id === profile.id ? <><FaPaperPlane className="mr-1" /> To:</> : <><FaInbox className="mr-1" /> From:</>}
                          <span className="font-semibold ml-2">
                            {msg.sender.id === profile.id ? msg.recipient.username : msg.sender.username}
                          </span>
                        </p>
                        <h3 className="text-lg font-semibold text-gray-800">{msg.subject}</h3>
                      </div>
                      {!msg.is_read && (
                        <span className="inline-block w-3 h-3 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{msg.body}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(msg.created_at).toLocaleDateString()} {new Date(msg.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Points Tab */}
        {activeTab === 'points' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Point Transactions History</h2>
            {transactions.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-5xl mb-4 text-gray-300 flex justify-center"><FaChartBar /></div>
                <p className="text-gray-600 mb-4">No point transactions yet</p>
                <p className="text-gray-500 text-sm">You'll earn points when you approve items or complete transactions!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map(transaction => (
                  <div key={transaction.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
                    transaction.points > 0 ? 'border-green-500' : 'border-red-500'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{transaction.action}</p>
                        {transaction.description && (
                          <p className="text-sm text-gray-600">{transaction.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.points > 0 ? '+' : ''}{transaction.points}
                        </p>
                        <p className="text-xs text-gray-500">{new Date(transaction.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Redemption Section */}
            {userPoints && userPoints.total_points > 0 && (
              <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><FaGift /> Redeem Your Points</h3>
                <p className="text-gray-600 mb-6">You have <strong className="text-purple-600">{userPoints.total_points} points</strong> to redeem</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold">
                    50 Points → Free Listing
                  </button>
                  <button className="bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold">
                    100 Points → $10 Credit
                  </button>
                  <button className="bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold">
                    150 Points → Premium Feature
                  </button>
                  <button className="bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold">
                    More Rewards Coming...
                  </button>
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
