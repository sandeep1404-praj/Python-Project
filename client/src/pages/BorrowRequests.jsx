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
    <div className="page-container py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-[#2f3b2b] mb-12 flex items-center gap-4">
          <FaClipboardList className="text-[#3a5333]" /> Request Journal
        </h1>

        {error && <div className="error-message mb-8">{error}</div>}
        {success && (
          <div className="mb-8 p-4 bg-green-50 border-l-4 border-[#3a5333] text-[#2f3b2b] text-sm animate-bounce-short">
            <span className="font-bold flex items-center gap-2">✨ {success}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-10 bg-[#f0ebe0]/50 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-8 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 text-sm ${
              activeTab === 'sent'
                ? 'bg-[#3a5333] text-white shadow-lg'
                : 'text-[#56624e] hover:bg-white/50'
            }`}
          >
            <FaPaperPlane className={activeTab === 'sent' ? 'text-[#d9e2c6]' : 'text-[#8a997d]'} /> 
            Sent Outgoing <span className={`ml-1 text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'sent' ? 'bg-white/20' : 'bg-[#e0d9c8]'}`}>{sentRequests.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`px-8 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 text-sm ${
              activeTab === 'received'
                ? 'bg-[#3a5333] text-white shadow-lg'
                : 'text-[#56624e] hover:bg-white/50'
            }`}
          >
            <FaInbox className={activeTab === 'received' ? 'text-[#d9e2c6]' : 'text-[#8a997d]'} /> 
            Received Incoming <span className={`ml-1 text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'received' ? 'bg-white/20' : 'bg-[#e0d9c8]'}`}>{receivedRequests.length}</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-[#3a5333] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#56624e] font-medium animate-pulse">Consulting the archives...</p>
          </div>
        ) : displayRequests.length === 0 ? (
          <div className="card py-24 text-center border-dashed border-2 bg-white/40">
            <div className="text-6xl mb-6 flex justify-center text-[#d9e2c6]">
              {activeTab === 'sent' ? <FaPaperPlane /> : <FaInbox />}
            </div>
            <h3 className="text-xl font-bold text-[#2f3b2b] mb-2">No active requests</h3>
            <p className="text-[#56624e] italic">
              {activeTab === 'sent' 
                ? 'Your request journal is currently empty' 
                : 'No one has requested your items yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {displayRequests.map(request => (
              <div key={request.id} className="card p-8 bg-white/80 hover:bg-white transition-all duration-300 border border-[#f0ebe0] group">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <h3 className="text-2xl font-display font-bold text-[#2f3b2b] group-hover:text-[#3a5333] transition-colors">
                        {request.item_name}
                       </h3>
                       <span className={`status-badge ${
                         request.status === 'APPROVED' ? 'status-badge-available' : 
                         request.status === 'PENDING' ? 'status-badge-pending' : 'status-badge-borrowed'
                       }`}>
                         {request.status}
                       </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-[#56624e] mt-2">
                      {activeTab === 'sent' ? (
                        <div className="flex items-center gap-2 bg-[#fbf7ee] px-4 py-1.5 rounded-full border border-[#f0ebe0]">
                           <FaPaperPlane className="text-[#8a997d] text-xs" />
                           <span>You initiated this transfer</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-[#fbf7ee] px-4 py-1.5 rounded-full border border-[#f0ebe0]">
                           <FaInbox className="text-[#8a997d] text-xs" />
                           <span>Requested by <strong className="text-[#2f3b2b] ml-1">{request.borrower_username}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 bg-[#fbf7ee]/50 p-6 rounded-2xl border border-[#f0ebe0] w-full lg:w-auto">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#8a997d] mb-1">Initiated</p>
                      <p className="text-sm font-bold text-[#2f3b2b]">{request.request_date ? new Date(request.request_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    {request.due_date && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#8a997d] mb-1">Due Date</p>
                        <p className="text-sm font-bold text-[#3a5333]">{new Date(request.due_date).toLocaleDateString()}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#8a997d] mb-1">Status</p>
                      <p className="text-sm font-bold text-[#2f3b2b]">{request.item_status}</p>
                    </div>
                    {request.return_date && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#8a997d] mb-1">Returned</p>
                        <p className="text-sm font-bold text-green-700">{new Date(request.return_date).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-[#fbf7ee] flex gap-4">
                  {/* Actions for received requests (you are the owner) */}
                  {activeTab === 'received' && request.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleApprove(request.id)}
                        disabled={actionLoading === request.id}
                        className="btn btn-primary px-8 flex items-center gap-2"
                      >
                        {actionLoading === request.id ? 'Updating Journal...' : <><FaCheck className="text-[10px]" /> Grant Permission</>}
                      </button>
                      <button
                        onClick={() => handleDeny(request.id)}
                        disabled={actionLoading === request.id}
                        className="btn btn-secondary px-8 flex items-center gap-2 border-red-100 hover:border-red-200"
                      >
                        {actionLoading === request.id ? 'Updating Journal...' : <><FaTimes className="text-[10px]" /> Decline</>}
                      </button>
                    </>
                  )}

                  {/* Actions for sent requests (you are the borrower) */}
                  {activeTab === 'sent' && request.status === 'APPROVED' && !request.return_date && (
                    <button
                      onClick={() => handleReturn(request.id)}
                      disabled={actionLoading === request.id}
                      className="btn btn-primary px-10 flex items-center gap-3 bg-[#56624e] shadow-lg"
                    >
                      {actionLoading === request.id ? 'Processing Return...' : <><FaUndo className="text-xs" /> Mark as Returned</>}
                    </button>
                  )}

                  {/* Status messages with improved semantics */}
                  {request.status === 'PENDING' && activeTab === 'sent' && (
                    <div className="flex items-center gap-2 text-[#8a997d] italic text-sm">
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                      Awaiting owner's blessing...
                    </div>
                  )}
                  {request.status === 'DENIED' && (
                    <p className="flex items-center gap-2 text-red-600 italic text-sm">
                      <FaTimes className="text-xs" /> This request was not accepted.
                    </p>
                  )}
                  {request.status === 'RETURNED' && (
                    <p className="flex items-center gap-2 text-[#3a5333] italic text-sm font-medium">
                      <FaCheck className="text-xs" /> Item has been safely returned to the library.
                    </p>
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
