import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService.js';
import { borrowService } from '../services/borrowService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { FaBoxOpen, FaStar, FaExchangeAlt, FaHandshake, FaCoins, FaMapMarkerAlt, FaUser, FaCheckCircle, FaComments, FaEdit, FaTrash } from 'react-icons/fa';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_ORIGIN}${imagePath}`;
};

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
      setSuccess('Request sent successfully! Redirecting to your requests...');
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
    navigate('/messages', { state: { recipientId: item.owner.id, itemName: item.name } });
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#3a5333] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#56624e] font-medium animate-pulse">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-[#d9e2c6] mb-4 flex justify-center"><FaBoxOpen /></div>
          <p className="text-rose-600 text-xl font-bold">Item not found</p>
          <button onClick={() => navigate('/browse')} className="btn btn-primary mt-6">Return to Browse</button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === item.owner.id;
  const isCustomer = user?.role === 'CUSTOMER';

  return (
    <div className="page-container pb-20">
      <div className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-[#56624e] font-bold uppercase text-xs tracking-widest hover:text-[#3a5333] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-[#3a5333] group-hover:text-white transition-all">
              <FaBoxOpen size={14} className="rotate-180" />
            </div>
            Go Back
          </button>
          
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white rounded-full text-[10px] font-black uppercase tracking-tighter text-[#8a997d] shadow-sm ring-1 ring-[#d9e2c6]">
              Ref: #{item.id}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Visual Gallery Section */}
          <div className="lg:col-span-7">
            <div className="card aspect-[4/3] relative overflow-hidden bg-white group">
              {item.image ? (
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#fbf7ee] to-[#f3e6c5] flex flex-col items-center justify-center">
                  <FaBoxOpen className="text-9xl text-[#d9e2c6]" />
                  <p className="mt-4 font-display font-medium text-[#56624e]">{item.category}</p>
                </div>
              )}
              
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className={`status-badge ${
                  item.status === 'APPROVED' ? 'status-badge-approved' : 'status-badge-pending'
                } shadow-lg backdrop-blur-md`}>
                  {item.status}
                </span>
              </div>
            </div>

            {/* Detailed Metadata Grid */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="card p-4 bg-white/50 text-center">
                  <span className="block text-[10px] uppercase font-bold text-[#8a997d] tracking-widest mb-1">Type</span>
                  <p className="font-bold text-[#2f3b2b] text-sm uppercase">{item.ownership_type}</p>
               </div>
               <div className="card p-4 bg-white/50 text-center">
                  <span className="block text-[10px] uppercase font-bold text-[#8a997d] tracking-widest mb-1">Category</span>
                  <p className="font-bold text-[#2f3b2b] text-sm uppercase">{item.category}</p>
               </div>
               <div className="card p-4 bg-white/50 text-center">
                  <span className="block text-[10px] uppercase font-bold text-[#8a997d] tracking-widest mb-1">Impact</span>
                  <p className="font-bold text-[#2f3b2b] text-sm uppercase">+12 Shares</p>
               </div>
               <div className="card p-4 bg-white/50 text-center">
                  <span className="block text-[10px] uppercase font-bold text-[#8a997d] tracking-widest mb-1">Condition</span>
                  <div className="flex justify-center text-amber-500 text-xs gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < (item.condition_score || 4) ? 'fill-current' : 'text-[#d9e2c6]'} />
                    ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Transaction & Info Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="card p-8 md:p-10 shadow-xl shadow-[#3a5333]/5 border-t-8 border-t-[#3a5333]">
              <div className="mb-10">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-[#2f3b2b] mb-4 leading-tight">{item.name}</h1>
                <p className="text-[#56624e] text-lg leading-relaxed">{item.description}</p>
              </div>

              {/* Action Zone */}
              <div className="space-y-4 pt-8 border-t border-[#fbf7ee]">
                {!isOwner && user && item.status === 'APPROVED' && !existingRequest && (
                  <button
                    onClick={handleBorrowRequest}
                    className="w-full btn btn-primary py-5 text-lg shadow-xl shadow-[#3a5333]/20 flex items-center justify-center gap-3 transition-transform active:scale-95"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <FaHandshake />
                        <span>Request this Item</span>
                      </>
                    )}
                  </button>
                )}

                {!isOwner && isCustomer && existingRequest && (
                  <div className="card bg-[#f8fcf5] border-[#3a5333]/20 p-6 text-center shadow-inner">
                    <p className={`text-lg font-bold mb-1 ${
                      existingRequest.status === 'APPROVED' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {existingRequest.status === 'PENDING' ? '⏳ Request Pending' : '✅ Request Approved'}
                    </p>
                    <p className="text-xs text-[#56624e] mb-4">
                      {existingRequest.status === 'PENDING' 
                        ? 'The owner has been notified of your interest.' 
                        : 'Coordinate your pickup in the borrow requests section.'}
                    </p>
                    <button
                      onClick={() => navigate('/borrow-requests')}
                      className="text-sm font-black uppercase text-[#3a5333] hover:underline decoration-2"
                    >
                      View Your Requests →
                    </button>
                  </div>
                )}

                {!isOwner && !user && (
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full btn btn-primary py-5 text-lg flex items-center justify-center gap-3"
                  >
                    <FaUser /> Login to Participate
                  </button>
                )}

                {isOwner && (
                  <div className="grid grid-cols-2 gap-4">
                    <button className="btn btn-secondary py-4 flex items-center justify-center gap-2">
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={actionLoading}
                      className="btn btn-danger py-4 flex items-center justify-center gap-2 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white"
                    >
                      {actionLoading ? '...' : <><FaTrash /> Delete</>}
                    </button>
                  </div>
                )}
                
                {!isOwner && user && (
                  <button
                    onClick={handleContactSeller}
                    className="w-full btn bg-white border-2 border-[#d9e2c6] text-[#2f3b2b] hover:bg-[#fbf7ee] py-4 flex items-center justify-center gap-3"
                  >
                    <FaComments className="text-[#3a5333]" /> Message Owner
                  </button>
                )}
              </div>
            </div>

            {/* Owner Profile Context */}
            <div className="card p-8 bg-gradient-to-br from-white to-[#fbf7ee]/30 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <FaMapMarkerAlt size={80} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#8a997d] mb-6">Shared By</h3>
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#3a5333] text-[#f8f1da] flex items-center justify-center text-2xl font-display font-bold shadow-lg shadow-[#3a5333]/10">
                  {item.owner.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xl font-bold text-[#2f3b2b]">{item.owner.username}</p>
                  <p className="text-sm text-[#56624e] flex items-center gap-1">
                    <FaMapMarkerAlt size={12} className="text-[#3a5333]" />
                    {item.owner.location || 'Local Community'}
                  </p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-[#f0ebe0] flex justify-between items-center">
                 <div>
                    <span className="block text-[10px] font-bold uppercase text-[#8a997d]">Member Trust</span>
                    <p className="text-xs font-bold text-[#3a5333]">Verified Neighbor</p>
                 </div>
                 <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#d9e2c6]" />)}
                 </div>
              </div>
            </div>

            <div className="text-center p-4">
              <p className="text-[10px] font-bold text-[#8a997d] uppercase tracking-widest">
                Added {new Date(item.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
