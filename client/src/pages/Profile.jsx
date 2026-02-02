import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import pointsService from '../services/pointsService.js';
import { useAuth } from '../context/AuthContext.jsx';

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
    <div className="min-h-screen bg-gray-50">
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
                className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition font-semibold"
              >
                ✏️ Edit Profile
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
                <p className="text-lg font-semibold">{profile.role === 'CUSTOMER' ? '👤 Customer' : '🔑 Staff'}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Location</p>
                <p className="text-lg font-semibold">{profile.location ? '📍 ' + profile.location : 'Not set'}</p>
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
                <div className="text-5xl">⭐</div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg shadow-md p-6 border-l-4 border-green-400">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-green-700 font-semibold text-sm mb-1">Transactions</p>
                  <p className="text-4xl font-bold text-green-600">{transactions.length}</p>
                </div>
                <div className="text-5xl">📊</div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg shadow-md p-6 border-l-4 border-blue-400">
              <div>
                <p className="text-blue-700 font-semibold text-sm mb-3">Quick Actions</p>
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold text-sm">
                  🎁 Redeem Points
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Listed Items</h2>
            {myItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-5xl mb-4">📦</div>
                <p className="text-gray-600 mb-4">You haven't added any items yet</p>
                <a href="/create-item" className="text-blue-600 hover:text-blue-800 font-semibold">
                  Add Your First Item →
                </a>
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
                        <p className="font-medium">{item.ownership_type === 'SELL' ? '💰 Sale' : item.ownership_type === 'EXCHANGE' ? '🔄 Exchange' : '🤝 Share'}</p>
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
                          <p className="font-medium text-yellow-500">{'⭐'.repeat(item.condition_score)}</p>
                        </div>
                      )}
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
                <div className="text-5xl mb-4">📋</div>
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
                      <p className="text-sm text-gray-600">
                        📅 Due: {new Date(req.due_date).toLocaleDateString()}
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
                <div className="text-5xl mb-4">💬</div>
                <p className="text-gray-600">You have no messages</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myMessages.map(msg => (
                  <div key={msg.id} className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${msg.is_read ? 'border-gray-300' : 'border-blue-500'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          {msg.sender.id === profile.id ? '📤 To:' : '📥 From:'}
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
                <div className="text-5xl mb-4">📊</div>
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
                <h3 className="text-2xl font-bold text-gray-800 mb-4">🎁 Redeem Your Points</h3>
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
  );
}
