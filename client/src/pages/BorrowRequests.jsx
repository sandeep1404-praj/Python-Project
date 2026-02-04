import React, { useState, useEffect } from 'react';
import { borrowService } from '../services/borrowService.js';
import { itemService } from '../services/itemService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { FaClipboardList, FaPaperPlane, FaInbox, FaCheck, FaTimes, FaUndo } from 'react-icons/fa';

export default function BorrowRequests() {
  const [requests, setRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState('sent'); // 'sent' or 'received'
  const { user } = useAuth();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await borrowService.getBorrowRequests();
      const allRequests = Array.isArray(data) ? data : [];
      
      // Separate sent and received requests
      // Sent: requests where I am the borrower
      // Received: requests where I am the item owner
      const sent = allRequests.filter(req => req.borrower === user?.id);
      const received = allRequests.filter(req => req.item_owner === user?.id);
      
      console.log('All requests:', allRequests);
      console.log('Sent requests:', sent);
      console.log('Received requests:', received);
      console.log('Current user ID:', user?.id);
      
      setRequests(allRequests);
      setSentRequests(sent);
      setReceivedRequests(received);
      setError('');
    } catch (err) {
      setError('Failed to load borrow requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    setError('');
    try {
      await borrowService.approveBorrowRequest(id);
      setSuccess('Request approved successfully!');
      setTimeout(() => setSuccess(''), 3000);
      loadRequests();
    } catch (err) {
      setError('Failed to approve request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeny = async (id) => {
    setActionLoading(id);
    setError('');
    try {
      await borrowService.denyBorrowRequest(id);
      setSuccess('Request denied successfully!');
      setTimeout(() => setSuccess(''), 3000);
      loadRequests();
    } catch (err) {
      setError('Failed to deny request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReturn = async (id) => {
    setActionLoading(id);
    setError('');
    try {
      await borrowService.returnItem(id);
      setSuccess('Item returned successfully!');
      setTimeout(() => setSuccess(''), 3000);
      loadRequests();
    } catch (err) {
      setError('Failed to return item');
    } finally {
      setActionLoading(null);
    }
  };

  const isStaff = user?.role === 'STAFF';
  const displayRequests = activeTab === 'sent' ? sentRequests : receivedRequests;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center gap-3"><FaClipboardList /> Borrow Requests</h1>

        {error && <div className="error-message mb-4">{error}</div>}
        {success && <div className="success-message mb-4">{success}</div>}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-6 py-3 font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'sent'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <FaPaperPlane /> Sent Requests ({sentRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`px-6 py-3 font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'received'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <FaInbox /> Received Requests ({receivedRequests.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading borrow requests...</p>
          </div>
        ) : displayRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-5xl mb-4 flex justify-center text-gray-400">
              {activeTab === 'sent' ? <FaPaperPlane /> : <FaInbox />}
            </div>
            <p className="text-gray-600 text-lg">
              {activeTab === 'sent' 
                ? 'You haven\'t sent any borrow requests yet' 
                : 'You haven\'t received any borrow requests yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayRequests.map(request => (
              <div key={request.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {request.item_name}
                    </h3>
                    <p className="text-gray-600">
                      {activeTab === 'sent' ? (
                        <span className="flex items-center gap-2"><FaPaperPlane /> You requested this item</span>
                      ) : (
                        <span className="flex items-center gap-2"><FaInbox /> Requested by: <strong>{request.borrower_username}</strong></span>
                      )}
                    </p>
                  </div>
                  <span className={`status-badge status-badge-${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                  <div>
                    <strong>Request Date:</strong>
                    <p>{request.request_date ? new Date(request.request_date).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  {request.due_date && (
                    <div>
                      <strong>Due Date:</strong>
                      <p>{new Date(request.due_date).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <strong>Item Status:</strong>
                    <p>{request.item_status}</p>
                  </div>
                  {request.return_date && (
                    <div>
                      <strong>Returned:</strong>
                      <p>{new Date(request.return_date).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {/* Actions for received requests (you are the owner) */}
                  {activeTab === 'received' && request.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleApprove(request.id)}
                        disabled={actionLoading === request.id}
                        className="btn btn-success btn-small flex items-center gap-1"
                      >
                        {actionLoading === request.id ? 'Processing...' : <><FaCheck /> Approve</>}
                      </button>
                      <button
                        onClick={() => handleDeny(request.id)}
                        disabled={actionLoading === request.id}
                        className="btn btn-danger btn-small flex items-center gap-1"
                      >
                        {actionLoading === request.id ? 'Processing...' : <><FaTimes /> Deny</>}
                      </button>
                    </>
                  )}

                  {/* Actions for sent requests (you are the borrower) */}
                  {activeTab === 'sent' && request.status === 'APPROVED' && !request.return_date && (
                    <button
                      onClick={() => handleReturn(request.id)}
                      disabled={actionLoading === request.id}
                      className="btn btn-warning btn-small flex items-center gap-1"
                    >
                      {actionLoading === request.id ? 'Processing...' : <><FaUndo /> Return Item</>}
                    </button>
                  )}

                  {/* Status messages */}
                  {request.status === 'PENDING' && activeTab === 'sent' && (
                    <p className="text-sm text-gray-500 italic">Waiting for owner approval...</p>
                  )}
                  {request.status === 'DENIED' && (
                    <p className="text-sm text-red-600 italic">This request was denied</p>
                  )}
                  {request.status === 'RETURNED' && (
                    <p className="text-sm text-green-600 italic">Item has been returned</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
