import React, { useState, useEffect } from 'react';
import { inspectionService } from '../services/inspectionService.js';
import { itemService } from '../services/itemService.js';
import approvalService from '../services/approvalService.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function InspectionReports() {
  const [pendingItems, setPendingItems] = useState([]);
  const [approvedItems, setApprovedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [selectedTab, setSelectedTab] = useState('pending');
  const [expandedItem, setExpandedItem] = useState(null);
  const [approvalForm, setApprovalForm] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pending, all] = await Promise.all([
        approvalService.getPendingItems(),
        itemService.getItems()
      ]);
      console.log('Pending items from API:', pending);
      console.log('All items from API:', all);
      setPendingItems(Array.isArray(pending) ? pending : []);
      const approved = Array.isArray(all) ? all.filter(item => item.status === 'APPROVED') : [];
      setApprovedItems(approved);
      setError('');
    } catch (err) {
      setError('Failed to load items');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveItem = async (itemId) => {
    const form = approvalForm[itemId] || {};
    const stars = parseInt(form.stars) || 4;
    const comment = form.comment || '';

    setActionLoading({ ...actionLoading, [itemId]: true });
    try {
      await approvalService.approveItem(itemId, stars, comment);
      setSuccess('Item approved successfully!');
      loadData();
      setApprovalForm({ ...approvalForm, [itemId]: {} });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve item');
    } finally {
      setActionLoading({ ...actionLoading, [itemId]: false });
    }
  };

  const handleRejectItem = async (itemId) => {
    const form = approvalForm[itemId] || {};
    const comment = form.rejectComment || 'Item does not meet quality standards';

    if (!confirm(`Reject this item? Reason: "${comment}"`)) return;

    setActionLoading({ ...actionLoading, [itemId]: true });
    try {
      await approvalService.rejectItem(itemId, comment);
      setSuccess('Item rejected successfully!');
      loadData();
      setApprovalForm({ ...approvalForm, [itemId]: {} });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject item');
    } finally {
      setActionLoading({ ...actionLoading, [itemId]: false });
    }
  };

  const handleFormChange = (itemId, field, value) => {
    setApprovalForm({
      ...approvalForm,
      [itemId]: {
        ...approvalForm[itemId],
        [field]: value
      }
    });
  };

  const isStaff = user?.role === 'STAFF';

  console.log('Current user:', user);
  console.log('Is staff:', isStaff);
  console.log('Pending items:', pendingItems);

  if (!isStaff) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow">
            <p className="font-bold text-lg mb-3">❌ Access Denied - Staff Only</p>
            <p className="mb-3">This page is for staff members who review and approve products.</p>
            <div className="bg-red-50 border border-red-300 rounded p-3 text-sm mb-3">
              <p><strong>To access this page:</strong></p>
              <ol className="list-decimal list-inside ml-2 mt-2 space-y-1">
                <li>Logout from your current account</li>
                <li>Login with a staff account (e.g., "codingsandeep@gmail.com" or "staff2")</li>
                <li>Return to this page</li>
              </ol>
            </div>
            {user && <p className="text-sm">Current role: <strong>{user.role}</strong></p>}
            {!user && <p className="text-sm">Please log in as a staff member.</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Staff Product Management</h1>
          <p className="text-gray-600">Approve, reject, and manage product listings</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setSelectedTab('pending')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              selectedTab === 'pending'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Pending Review ({pendingItems.length})
          </button>
          <button
            onClick={() => setSelectedTab('approved')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              selectedTab === 'approved'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Approved ({approvedItems.length})
          </button>
        </div>

        {/* Pending Items */}
        {selectedTab === 'pending' && (
          <div>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Loading items...</p>
              </div>
            ) : pendingItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-5xl mb-4">✅</div>
                <p className="text-gray-600 text-lg">All products have been reviewed!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingItems.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="border-l-4 border-yellow-500 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.name}</h3>
                          <div className="flex gap-3 flex-wrap mb-3">
                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-sm font-semibold rounded">
                              ID: {item.id}
                            </span>
                            <span className={`inline-block px-3 py-1 text-sm font-semibold rounded ${
                              item.ownership_type === 'SELL' ? 'bg-blue-100 text-blue-800' :
                              item.ownership_type === 'EXCHANGE' ? 'bg-purple-100 text-purple-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {item.ownership_type}
                            </span>
                            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-sm font-semibold rounded">
                              📁 {item.category}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{item.description}</p>
                          <div className="text-sm text-gray-500">
                            <p>Listed by: <strong>{item.owner.username}</strong> • {item.owner.email}</p>
                            {item.owner.location && (
                              <p>Location: <strong>📍 {item.owner.location}</strong></p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Approval Form */}
                      {expandedItem === item.id && (
                        <div className="border-t pt-6 mt-6 bg-gray-50 -mx-6 px-6 py-6">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">Review & Approve Product</h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Quality Rating (Stars)</label>
                              <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <button
                                    key={star}
                                    onClick={() => handleFormChange(item.id, 'stars', star)}
                                    className={`text-3xl transition ${
                                      (approvalForm[item.id]?.stars || 4) >= star
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  >
                                    ⭐
                                  </button>
                                ))}
                              </div>
                              <p className="text-sm text-gray-600 mt-2">
                                Rating: {approvalForm[item.id]?.stars || 4} / 5
                              </p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Approval Comment</label>
                              <textarea
                                value={approvalForm[item.id]?.comment || ''}
                                onChange={(e) => handleFormChange(item.id, 'comment', e.target.value)}
                                placeholder="Add any comments about this product..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                rows="3"
                              />
                            </div>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
                            <p className="text-sm text-yellow-800">
                              <strong>Note:</strong> Once approved, this product will be visible to all users and the owner will earn 10 points.
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => handleApproveItem(item.id)}
                              disabled={actionLoading[item.id]}
                              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                            >
                              {actionLoading[item.id] ? 'Processing...' : '✅ Approve Product'}
                            </button>
                            <button
                              onClick={() => setExpandedItem(null)}
                              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Reject Form */}
                      {expandedItem === `reject-${item.id}` && (
                        <div className="border-t pt-6 mt-6 bg-red-50 -mx-6 px-6 py-6">
                          <h4 className="text-lg font-semibold text-red-800 mb-4">Reject Product</h4>

                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection</label>
                            <textarea
                              value={approvalForm[item.id]?.rejectComment || ''}
                              onChange={(e) => handleFormChange(item.id, 'rejectComment', e.target.value)}
                              placeholder="Explain why this product is being rejected..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                              rows="4"
                            />
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => handleRejectItem(item.id)}
                              disabled={actionLoading[item.id]}
                              className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
                            >
                              {actionLoading[item.id] ? 'Processing...' : '❌ Reject Product'}
                            </button>
                            <button
                              onClick={() => setExpandedItem(null)}
                              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {expandedItem !== item.id && expandedItem !== `reject-${item.id}` && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => setExpandedItem(item.id)}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => setExpandedItem(`reject-${item.id}`)}
                            className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Approved Items */}
        {selectedTab === 'approved' && (
          <div>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Loading items...</p>
              </div>
            ) : approvedItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-gray-600 text-lg">No approved products yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {approvedItems.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-green-500">
                    <div className="h-40 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-5xl mb-2">✅</div>
                        <p className="font-semibold">{item.category}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex gap-2 mb-3">
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          item.ownership_type === 'SELL' ? 'bg-blue-100 text-blue-800' :
                          item.ownership_type === 'EXCHANGE' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.ownership_type}
                        </span>
                        {item.condition_score && (
                          <span className="text-yellow-500 text-sm">
                            {'⭐'.repeat(item.condition_score)}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        <p>Owner: <strong>{item.owner.username}</strong></p>
                        <p>Status: <strong className="text-green-600">Approved</strong></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
