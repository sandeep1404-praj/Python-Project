import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { FaPaperPlane, FaInbox, FaEnvelope, FaRegEnvelope, FaUser, FaClock, FaTag, FaChevronDown, FaChevronUp, FaPlus, FaTimes } from 'react-icons/fa';

const messageService = {
  sendMessage: async (recipientId, subject, body) => {
    const response = await api.post('/messages/', {
      recipient: recipientId,
      subject,
      body
    });
    return response.data;
  },
  getInbox: async () => {
    const response = await api.get('/messages/inbox/');
    return response.data;
  },
  getSent: async () => {
    const response = await api.get('/messages/sent/');
    return response.data;
  },
  markAsRead: async (messageId) => {
    const response = await api.post(`/messages/${messageId}/mark_as_read/`);
    return response.data;
  },
  getMessages: async () => {
    const response = await api.get('/messages/');
    return response.data;
  }
};

export default function Messages() {
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tab, setTab] = useState('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [formData, setFormData] = useState({
    recipientId: '',
    subject: '',
    body: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    // Check if coming from browse with item contact
    if (location.state?.recipientId) {
      setShowCompose(true);
      setFormData(prev => ({
        ...prev,
        recipientId: location.state.recipientId,
        subject: location.state.itemName ? `Interested in: ${location.state.itemName}` : ''
      }));
    }
  }, [location.state?.recipientId]);

  useEffect(() => {
    if (tab === 'inbox') {
      markUnreadAsRead();
    }
  }, [tab]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const [inboxData, sentData] = await Promise.all([
        messageService.getInbox(),
        messageService.getSent()
      ]);
      setInbox(Array.isArray(inboxData) ? inboxData : []);
      setSent(Array.isArray(sentData) ? sentData : []);
      setError('');
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markUnreadAsRead = async () => {
    const unreadMessages = inbox.filter(msg => !msg.is_read);
    for (const msg of unreadMessages) {
      try {
        await messageService.markAsRead(msg.id);
      } catch (err) {
        console.error('Failed to mark message as read:', err);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!formData.recipientId || !formData.subject || !formData.body) {
      setError('Please fill in all fields');
      return;
    }

    setFormLoading(true);
    try {
      await messageService.sendMessage(
        formData.recipientId,
        formData.subject,
        formData.body
      );
      setSuccess('Message sent successfully!');
      setFormData({ recipientId: '', subject: '', body: '' });
      setShowCompose(false);
      loadMessages();
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setFormLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getRecipientName = (message) => {
    return tab === 'inbox' ? message.sender.username : message.recipient.username;
  };

  const messages = tab === 'inbox' ? inbox : sent;

  return (
    <div className="page-container pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-[#2f3b2b] tracking-tight">Correspondence</h1>
          <p className="text-[#56624e] font-medium mt-1">"Communication is the binder of community."</p>
        </div>
        <button
          onClick={() => setShowCompose(!showCompose)}
          className={`hidden items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-bold ${
            showCompose 
              ? 'bg-[#fbf7ee] text-[#3a5333] border border-[#d9e2c6]' 
              : 'bg-[#3a5333] text-white shadow-lg hover:shadow-[#3a5333]/30'
          }`}
        >
          {showCompose ? <><FaTimes /> Close Draft</> : <><FaPlus /> New Message</>}
        </button>
      </div>

      {error && <div className="error-message mb-8">{error}</div>}
      {success && (
        <div className="bg-[#f0f9f1] border border-[#d1e7d3] text-[#3a5333] px-6 py-4 rounded-xl mb-8 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#3a5333] animate-pulse"></div>
          <p className="font-bold text-sm uppercase tracking-wider">{success}</p>
        </div>
      )}

      {/* Compose Form */}
      {showCompose && (
        <div className="card p-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-[#fbf7ee] rounded-xl text-[#3a5333]">
              <FaPaperPlane />
            </div>
            <h2 className="text-2xl font-display font-bold text-[#2f3b2b]">Compose Draft</h2>
          </div>
          
          <form onSubmit={handleSendMessage} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="form-group">
                <label className="form-label">Subject Line</label>
                <div className="relative">
                  <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a997d]" size={14} />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Nature of Inquiry"
                    className="input-base pl-12"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Message Content</label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleChange}
                placeholder="Share your thoughts..."
                className="input-base min-h-[160px] py-4"
                required
              />
            </div>
            <div className="flex justify-end">
               <button
                type="submit"
                disabled={formLoading}
                className="btn btn-primary px-10 py-4 rounded-xl shadow-xl hover:shadow-[#3a5333]/30 disabled:opacity-50"
              >
                {formLoading ? 'Transmitting...' : 'Dispatch Message'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs & Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <button
            onClick={() => { setTab('inbox'); setSelectedMessage(null); }}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 font-bold group ${
              tab === 'inbox' 
                ? 'bg-[#3a5333] text-white shadow-lg' 
                : 'bg-white text-[#56624e] hover:bg-[#fbf7ee] border border-[#f0ebe0]'
            }`}
          >
            <div className="flex items-center gap-3">
              <FaInbox className={tab === 'inbox' ? 'text-white' : 'text-[#3a5333]'} />
              <span>Inbox</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              tab === 'inbox' ? 'bg-white text-[#3a5333]' : 'bg-[#fbf7ee] text-[#8a997d]'
            }`}>
              {inbox.length}
            </span>
          </button>
          
          <button
            onClick={() => { setTab('sent'); setSelectedMessage(null); }}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 font-bold group ${
              tab === 'sent' 
                ? 'bg-[#3a5333] text-white shadow-lg' 
                : 'bg-white text-[#56624e] hover:bg-[#fbf7ee] border border-[#f0ebe0]'
            }`}
          >
            <div className="flex items-center gap-3">
              <FaPaperPlane className={tab === 'sent' ? 'text-white' : 'text-[#3a5333]'} />
              <span>Dispatch</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              tab === 'sent' ? 'bg-white text-[#3a5333]' : 'bg-[#fbf7ee] text-[#8a997d]'
            }`}>
              {sent.length}
            </span>
          </button>
        </div>

        {/* Message Content Area */}
        <div className="lg:col-span-9">
          {loading ? (
            <div className="card py-24 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-[#3a5333] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[#8a997d] font-black uppercase tracking-widest text-[10px]">Retrieving Records...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="card border-dashed border-2 py-32 flex flex-col items-center justify-center text-center">
               <div className="text-6xl text-[#d9e2c6] mb-6">
                  {tab === 'inbox' ? <FaEnvelope /> : <FaPaperPlane />}
               </div>
               <h3 className="text-xl font-bold text-[#2f3b2b] mb-2">No {tab} records found</h3>
               <p className="text-[#56624e]">Your digital archive is currently empty.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`card transition-all duration-500 overflow-hidden border border-[#f0ebe0] ${
                    selectedMessage?.id === message.id ? 'ring-2 ring-[#3a5333]/10 shadow-2xl scale-[1.01]' : 'hover:shadow-lg'
                  }`}
                >
                  <div 
                    onClick={() => setSelectedMessage(selectedMessage?.id === message.id ? null : message)}
                    className={`p-6 cursor-pointer flex items-center gap-6 ${
                      !message.is_read && tab === 'inbox' ? 'bg-[#fbf7ee]/60' : ''
                    }`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-[#fbf7ee] flex items-center justify-center text-[#3a5333] border border-[#d9e2c6] font-display font-bold text-lg shadow-sm">
                        {getRecipientName(message).charAt(0).toUpperCase()}
                      </div>
                      {!message.is_read && tab === 'inbox' && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#3a5333] border-2 border-white rounded-full"></span>
                      )}
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className={`font-bold truncate ${!message.is_read && tab === 'inbox' ? 'text-[#3a5333]' : 'text-[#2f3b2b]'}`}>
                          {getRecipientName(message)}
                        </h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#8a997d] flex items-center gap-1">
                          <FaClock size={10} /> {formatDate(message.created_at)}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${!message.is_read && tab === 'inbox' ? 'text-[#56624e] font-semibold' : 'text-[#8a997d]'}`}>
                        {message.subject}
                      </p>
                    </div>

                    <div className="text-[#d9e2c6]">
                      {selectedMessage?.id === message.id ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                    </div>
                  </div>

                  {selectedMessage?.id === message.id && (
                    <div className="p-8 bg-[#fbf7ee]/30 border-t border-[#f0ebe0] animate-in fade-in duration-500">
                      <div className="max-w-none prose prose-stone">
                         <p className="text-[#2f3b2b] leading-relaxed whitespace-pre-wrap font-medium">
                           {message.body}
                         </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
