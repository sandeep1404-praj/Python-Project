import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService.js';
import { borrowService } from '../services/borrowService.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [existingRequest, setExistingRequest] = useState(null);

  useEffect(() => {
    loadItem();
    if (user) {
      checkExistingRequest();
    }
  }, [id, user]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const data = await itemService.getItem(id);
      setItem(data);
      setError('');
    } catch (err) {
      setError('Failed to load item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkExistingRequest = async () => {
    try {
      const requests = await borrowService.getBorrowRequests();
      const existing = requests.find(
        req => req.item === parseInt(id) && 
        req.borrower === user?.id &&
        (req.status === 'PENDING' || req.status === 'APPROVED')
      );
      setExistingRequest(existing);
    } catch (err) {
      console.error('Error checking existing requests:', err);
    }
  };

  const handleBorrowRequest = async () => {
    setActionLoading(true);
    setError('');
    try {
      await borrowService.createBorrowRequest(id);
      setSuccess('✅ Request sent successfully! Redirecting to your requests...');
      setTimeout(() => navigate('/borrow-requests'), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to send borrow request';
      setError(errorMsg);
      console.error('Borrow request error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setActionLoading(true);
    try {
      await itemService.deleteItem(id);
      setSuccess('Item deleted successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Failed to delete item');
    } finally {
      setActionLoading(false);
    }
  };

  const handleContactSeller = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/messages', { state: { itemId: item.id, recipientId: item.owner.id } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading item...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 text-lg">Item not found</p>
      </div>
    );
  }

  const isOwner = user?.id === item.owner.id;
  const isCustomer = user?.role === 'CUSTOMER';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 font-semibold mb-6 flex items-center gap-2"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Product Image/Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="h-96 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-9xl mb-4">📦</div>
                  <p className="text-lg font-semibold">{item.category}</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{item.name}</h1>
                <div className="flex gap-2 flex-wrap mb-4">
                  <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${
                    item.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                  <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${
                    item.ownership_type === 'SELL' ? 'bg-blue-100 text-blue-800' :
                    item.ownership_type === 'EXCHANGE' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.ownership_type === 'SELL' ? '💰 For Sale' :
                     item.ownership_type === 'EXCHANGE' ? '🔄 Exchange' :
                     '🤝 Share'}
                  </span>
                  <span className="inline-block px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-800">
                    📁 {item.category}
                  </span>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed text-lg">{item.description}</p>
              </div>

              {/* Condition Rating */}
              {item.condition_score && (
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Condition</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-500 text-2xl">
                      {'⭐'.repeat(item.condition_score)}
                    </span>
                    <span className="text-gray-600 text-lg">{item.condition_score}/5 - Quality Rating</span>
                  </div>
                </div>
              )}

              {/* Date */}
              <div className="text-gray-500 text-sm">
                Listed on {new Date(item.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Seller Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Seller Information</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                  {item.owner.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{item.owner.username}</p>
                  <p className="text-sm text-gray-600">Community Member</p>
                </div>
              </div>

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-800 font-medium">{item.owner.email}</p>
                </div>
                {item.owner.location && (
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-gray-800 font-medium">📍 {item.owner.location}</p>
                  </div>
                )}
              </div>

              {!isOwner && user && (
                <button
                  onClick={handleContactSeller}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
                >
                  💬 Send Message
                </button>
              )}

              {!isOwner && !user && (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
                >
                  Login to Contact
                </button>
              )}

              {/* Request Button for Customers */}
              {!isOwner && isCustomer && item.status === 'APPROVED' && !existingRequest && (
                <button
                  onClick={handleBorrowRequest}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <span>⏳ Sending Request...</span>
                  ) : (
                    <>
                      <span>📦</span>
                      <span>Request Product</span>
                    </>
                  )}
                </button>
              )}

              {!isOwner && isCustomer && existingRequest && (
                <div className="w-full bg-blue-100 text-blue-800 py-3 px-4 rounded-lg font-semibold text-center border-2 border-blue-300">
                  {existingRequest.status === 'PENDING' && (
                    <>
                      <div className="text-lg mb-1">⏳ Request Pending</div>
                      <div className="text-sm">Waiting for owner approval</div>
                    </>
                  )}
                  {existingRequest.status === 'APPROVED' && (
                    <>
                      <div className="text-lg mb-1">✅ Request Approved</div>
                      <div className="text-sm">Check Borrow Requests page</div>
                    </>
                  )}
                  <button
                    onClick={() => navigate('/borrow-requests')}
                    className="mt-2 text-sm underline hover:no-underline"
                  >
                    View Your Requests →
                  </button>
                </div>
              )}

              {!isOwner && isCustomer && item.status !== 'APPROVED' && (
                <div className="w-full bg-gray-100 text-gray-600 py-3 rounded-lg font-semibold text-center">
                  ⏳ Item not yet approved
                </div>
              )}

              {!isOwner && !isCustomer && !user && (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Login to Request
                </button>
              )}
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Owner Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition">
                    ✏️ Edit Item
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={actionLoading}
                    className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
                  >
                    {actionLoading ? 'Deleting...' : '🗑️ Delete Item'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
