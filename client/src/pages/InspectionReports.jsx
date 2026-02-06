import React, { useState, useEffect } from 'react';
import { inspectionService } from '../services/inspectionService.js';
import { itemService } from '../services/itemService.js';
import approvalService from '../services/approvalService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { FaTimesCircle, FaCheckCircle, FaFolder, FaMapMarkerAlt, FaStar, FaCheck, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_ORIGIN}${imagePath}`;
};

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
      <div className="page-container min-h-screen flex items-center justify-center p-6">
        <div className="card max-w-2xl p-10 bg-white/80 backdrop-blur-md border border-red-100 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTimesCircle className="text-4xl text-red-500" />
            </div>
            <h1 className="text-3xl font-display font-bold text-[#2f3b2b] mb-4">Guardians Only</h1>
            <p className="text-[#56624e] text-lg">This sanctum is reserved for library staff responsible for reviewing and approving community contributions.</p>
          </div>

          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 text-sm text-red-800 mb-8">
            <p className="font-bold mb-3 flex items-center gap-2">🔑 Required Credentials:</p>
            <ul className="space-y-3 list-none">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                Staff Clearance Level (Role: STAFF)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                Verified Library Manager Identity
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center gap-4">
             <Link to="/login" className="btn btn-primary px-10 py-3 shadow-lg hover:shadow-[#3a5333]/30">
               Switch to Staff Account
             </Link>
             {user && <p className="text-xs text-[#8a997d] font-black uppercase tracking-widest">Current Signature: {user.role}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[#2f3b2b] mb-4">Curator's Workshop</h1>
          <p className="text-[#56624e] text-lg">Review and validate the quality of incoming community resources.</p>
        </div>

        {error && <div className="error-message mb-8">{error}</div>}
        {success && (
          <div className="mb-8 p-4 bg-green-50 border-l-4 border-[#3a5333] text-[#2f3b2b] text-sm animate-bounce-short">
            <span className="font-bold flex items-center gap-2">✨ {success}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-10 bg-[#f0ebe0]/50 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setSelectedTab('pending')}
            className={`px-8 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 text-sm ${
              selectedTab === 'pending'
                ? 'bg-[#3a5333] text-white shadow-lg'
                : 'text-[#56624e] hover:bg-white/50'
            }`}
          >
            Awaiting Review <span className={`ml-1 text-[10px] px-2 py-0.5 rounded-full ${selectedTab === 'pending' ? 'bg-white/20' : 'bg-[#e0d9c8]'}`}>{pendingItems.length}</span>
          </button>
          <button
            onClick={() => setSelectedTab('approved')}
            className={`px-8 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 text-sm ${
              selectedTab === 'approved'
                ? 'bg-[#3a5333] text-white shadow-lg'
                : 'text-[#56624e] hover:bg-white/50'
            }`}
          >
            Validated Archive <span className={`ml-1 text-[10px] px-2 py-0.5 rounded-full ${selectedTab === 'approved' ? 'bg-white/20' : 'bg-[#e0d9c8]'}`}>{approvedItems.length}</span>
          </button>
        </div>

        {/* Pending Items */}
        {selectedTab === 'pending' && (
          <div>
            {loading ? (
              <div className="flex flex-col justify-center items-center py-24">
                <div className="w-12 h-12 border-4 border-[#3a5333] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-[#56624e] font-medium animate-pulse">Scanning the catalog queue...</p>
              </div>
            ) : pendingItems.length === 0 ? (
              <div className="card py-24 text-center border-dashed border-2 bg-white/40">
                <div className="text-6xl mb-6 flex justify-center text-[#d9e2c6]">
                  <FaCheckCircle />
                </div>
                <h3 className="text-xl font-bold text-[#2f3b2b] mb-2">Queue is Empty</h3>
                <p className="text-[#56624e] italic">Every contribution has been curated. Excellent work!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                {pendingItems.map(item => (
                  <div key={item.id} className="card overflow-hidden bg-white hover:bg-[#fbf7ee]/20 transition-all duration-300 border border-[#f0ebe0]">
                    <div className="p-8 border-l-8 border-amber-400">
                      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-8">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <h3 className="text-2xl font-display font-bold text-[#2f3b2b]">{item.name}</h3>
                            <span className="text-[10px] font-black uppercase tracking-widest bg-[#fbf7ee] text-[#8a997d] px-3 py-1 rounded-full border border-[#f0ebe0]">ID: {item.id}</span>
                          </div>
                          
                          <div className="flex gap-2 mb-6">
                            <span className="status-badge status-badge-available px-4">{item.ownership_type}</span>
                            <span className="flex items-center gap-2 bg-[#fbf7ee] text-[#56624e] text-xs font-bold px-4 py-1.5 rounded-full border border-[#f0ebe0]">
                              <FaFolder className="text-[#8a997d]" /> {item.category}
                            </span>
                          </div>
                          
                          <p className="text-[#56624e] text-lg italic mb-6 leading-relaxed">"{item.description}"</p>
                          
                          <div className="bg-[#fbf7ee]/50 p-6 rounded-2xl border border-[#f0ebe0]">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#8a997d] mb-2">Contributor Signature</p>
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#3a5333] border border-[#d9e2c6] shadow-sm font-bold font-display">
                                 {item.owner.username?.charAt(0).toUpperCase()}
                               </div>
                               <div>
                                 <p className="text-sm font-bold text-[#2f3b2b] leading-tight">{item.owner.username}</p>
                                 <p className="text-xs text-[#56624e]">{item.owner.email}</p>
                               </div>
                            </div>
                            {item.owner.location && (
                              <div className="mt-4 flex items-center gap-2 text-xs text-[#56624e]">
                                <FaMapMarkerAlt className="text-[#3a5333]" />
                                <span>{item.owner.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Image Preview if available */}
                        {item.image && (
                          <div className="w-full lg:w-72 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl rotate-1 group-hover:rotate-0 transition-transform duration-500">
                             <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      {/* Approval Interaction Logic */}
                      {expandedItem === item.id && (
                        <div className="mt-8 pt-8 border-t border-[#fbf7ee] animate-fade-in">
                          <h4 className="text-xl font-display font-bold text-[#2f3b2b] mb-6 flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600"><FaCheckCircle /></div>
                            Quality Certification
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
                            <div className="card p-6 bg-white/50 border border-[#f0ebe0]">
                              <label className="form-label text-[10px] uppercase tracking-widest text-[#8a997d]">Integrity Score</label>
                              <div className="flex gap-3 my-4">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <button
                                    key={star}
                                    onClick={() => handleFormChange(item.id, 'stars', star)}
                                    className={`text-3xl transition-all duration-300 hover:scale-125 ${
                                      (approvalForm[item.id]?.stars || 4) >= star
                                        ? 'text-amber-400 drop-shadow-sm'
                                        : 'text-[#e0d9c8]'
                                    }`}
                                  >
                                    <FaStar />
                                  </button>
                                ))}
                              </div>
                              <p className="text-sm font-bold text-[#56624e]">
                                Validating as <span className="text-[#3a5333]">{approvalForm[item.id]?.stars || 4}-Star</span> Resource
                              </p>
                            </div>

                            <div className="form-group">
                              <label className="form-label text-[10px] uppercase tracking-widest text-[#8a997d]">Curator's Notes</label>
                              <textarea
                                value={approvalForm[item.id]?.comment || ''}
                                onChange={(e) => handleFormChange(item.id, 'comment', e.target.value)}
                                placeholder="Observations on condition and authenticity..."
                                className="input-base h-24 bg-white"
                              />
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <button
                              onClick={() => handleApproveItem(item.id)}
                              disabled={actionLoading[item.id]}
                              className="btn btn-primary px-10 py-3 shadow-xl hover:shadow-[#3a5333]/30 flex-1 flex items-center justify-center gap-3"
                            >
                              {actionLoading[item.id] ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : <><FaCheck className="text-xs" /> Finalize Validation</>}
                            </button>
                            <button
                              onClick={() => setExpandedItem(null)}
                              className="btn btn-secondary px-8 font-bold"
                            >
                              Discard Changes
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Rejection Interaction Logic */}
                      {expandedItem === `reject-${item.id}` && (
                        <div className="mt-8 pt-8 border-t border-red-50 animate-fade-in">
                          <h4 className="text-xl font-display font-bold text-red-800 mb-6 flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-500"><FaTimesCircle /></div>
                            Refusal Declaration
                          </h4>

                          <div className="form-group mb-8">
                            <label className="form-label text-[10px] uppercase tracking-widest text-[#8a997d]">Reason for Refusal</label>
                            <textarea
                              value={approvalForm[item.id]?.rejectComment || ''}
                              onChange={(e) => handleFormChange(item.id, 'rejectComment', e.target.value)}
                              placeholder="Clearly state why this resource cannot join the library..."
                              className="input-base h-32 bg-white border-red-100 focus:ring-red-500"
                            />
                          </div>

                          <div className="flex gap-4">
                            <button
                              onClick={() => handleRejectItem(item.id)}
                              disabled={actionLoading[item.id]}
                              className="btn px-10 py-3 bg-red-600 text-white rounded-xl font-bold shadow-xl hover:bg-red-700 transition-all flex-1 flex items-center justify-center gap-3"
                            >
                              {actionLoading[item.id] ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : <><FaTimes className="text-xs" /> Issue Refusal</>}
                            </button>
                            <button
                              onClick={() => setExpandedItem(null)}
                              className="btn btn-secondary px-8 font-bold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Curator Core Controls */}
                      {expandedItem !== item.id && expandedItem !== `reject-${item.id}` && (
                        <div className="flex gap-4 mt-8 pt-8 border-t border-[#fbf7ee]">
                          <button
                            onClick={() => setExpandedItem(item.id)}
                            className="btn btn-primary px-10 py-3 flex-1 flex items-center justify-center gap-3 shadow-lg hover:shadow-[#3a5333]/20"
                          >
                            <FaCheck className="text-xs" /> Begin Review
                          </button>
                          <button
                            onClick={() => setExpandedItem(`reject-${item.id}`)}
                            className="btn btn-secondary px-10 py-3 flex-1 flex items-center justify-center gap-3 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                          >
                            <FaTimes className="text-xs" /> Refuse Resource
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

        {/* Approved Items Archive */}
        {selectedTab === 'approved' && (
          <div>
            {loading ? (
              <div className="flex flex-col justify-center items-center py-24">
                <div className="w-12 h-12 border-4 border-[#3a5333] border-t-transparent rounded-full animate-spin mb-4"></div>
              </div>
            ) : approvedItems.length === 0 ? (
              <div className="card py-24 text-center border-dashed border-2 bg-white/40">
                <div className="text-6xl mb-6 flex justify-center text-[#d9e2c6]">📭</div>
                <h3 className="text-xl font-bold text-[#2f3b2b] mb-2">Archive is Empty</h3>
                <p className="text-[#56624e]">No products have been validated in this cycle.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {approvedItems.map(item => (
                  <div key={item.id} className="card group overflow-hidden border border-[#f0ebe0] bg-white hover:shadow-2xl transition-all duration-500">
                    <div className="h-44 bg-gradient-to-br from-[#3a5333] to-[#2f3b2b] flex items-center justify-center relative">
                      <div className="absolute inset-0 opacity-10 flex items-center justify-center text-9xl text-white pointer-events-none">
                        <FaCheckCircle />
                      </div>
                      <div className="relative z-10 text-center">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl">
                           <FaCheck className="text-white text-2xl" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#d9e2c6]">{item.category}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-display font-bold text-[#2f3b2b] mb-2 group-hover:text-[#3a5333] transition-colors">{item.name}</h3>
                      <p className="text-[#56624e] text-sm mb-6 line-clamp-2 italic">"{item.description}"</p>
                      
                      <div className="flex justify-between items-center pt-6 border-t border-[#fbf7ee]">
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#8a997d] mb-1">Status</p>
                            <span className="status-badge status-badge-available px-3">Validated</span>
                         </div>
                         <div className="text-right">
                           <p className="text-[10px] font-black uppercase tracking-widest text-[#8a997d] mb-1">Quality</p>
                           <div className="flex gap-0.5 text-amber-500 text-xs">
                             {[...Array(item.condition_score)].map((_, i) => <FaStar key={i} />)}
                           </div>
                         </div>
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
