import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const messageService = {
  sendMessage: async (recipientId, subject, body, itemId = null) => {
    const response = await api.post('/messages/', {
      recipient: recipientId,
      subject,
      body,
      item: itemId
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
        subject: location.state.itemId ? `Interested in item #${location.state.itemId}` : ''
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
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getRecipientName = (message) => {
    return tab === 'inbox' ? message.sender.username : message.recipient.username;
  };

  const getRecipientEmail = (message) => {
    return tab === 'inbox' ? message.sender.email : message.recipient.email;
  };

  const messages = tab === 'inbox' ? inbox : sent;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Messages</h1>
          <button
            onClick={() => setShowCompose(!showCompose)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {showCompose ? 'Cancel' : '+ New Message'}
          </button>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">{success}</div>}

        {/* Compose Form */}
        {showCompose && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Compose Message</h2>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient ID</label>
                <input
                  type="number"
                  name="recipientId"
                  value={formData.recipientId}
                  onChange={handleChange}
                  placeholder="Enter recipient user ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Message subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-32"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={formLoading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {formLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab('inbox')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              tab === 'inbox'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Inbox ({inbox.length})
          </button>
          <button
            onClick={() => setTab('sent')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              tab === 'sent'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Sent ({sent.length})
          </button>
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No messages in {tab}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {messages.map(message => (
              <div
                key={message.id}
                onClick={() => setSelectedMessage(selectedMessage?.id === message.id ? null : message)}
                className={`border-b p-4 cursor-pointer hover:bg-gray-50 transition ${
                  !message.is_read && tab === 'inbox' ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800">
                        {getRecipientName(message)}
                      </p>
                      {!message.is_read && tab === 'inbox' && (
                        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-gray-600">{message.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(message.created_at)}</p>
                  </div>
                  <span className="text-xs text-gray-500">{getRecipientEmail(message)}</span>
                </div>

                {selectedMessage?.id === message.id && (
                  <div className="mt-4 pt-4 border-t bg-gray-50 -mx-4 px-4 py-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{message.body}</p>
                    {message.item && (
                      <div className="mt-4 bg-white p-3 rounded border border-gray-200">
                        <p className="text-xs text-gray-600">Related to item:</p>
                        <p className="font-semibold text-gray-800">{message.item.name}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
