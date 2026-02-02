import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService.js';

export default function CreateItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    ownership_type: 'SELL',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Item name is required');
      return;
    }

    if (!formData.category.trim()) {
      setError('Category is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    setLoading(true);

    try {
      await itemService.createItem(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="btn btn-secondary mb-6"
        >
          ← Back to Items
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Add New Item</h1>

          {error && <div className="error-message mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label">Item Name</label>
              <input
                type="text"
                name="name"
                className="input-base"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter item name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                name="category"
                className="input-base"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Electronics, Books, Furniture"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="input-base min-h-32"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your item in detail"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ownership Type</label>
              <select
                name="ownership_type"
                className="input-base"
                value={formData.ownership_type}
                onChange={handleChange}
              >
                <option value="SELL">For Sale</option>
                <option value="EXCHANGE">For Exchange</option>
                <option value="SHARE">For Sharing</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1"
              >
                {loading ? 'Creating...' : 'Create Item'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
