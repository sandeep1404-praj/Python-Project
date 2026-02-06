import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { itemService } from '../services/itemService.js';
import { FaBox, FaTags, FaImage, FaCheckCircle, FaChevronRight, FaChevronLeft, FaCamera } from 'react-icons/fa';

export default function CreateItem() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    ownership_type: 'SELL',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const steps = [
    { title: 'Basic Info', icon: FaBox },
    { title: 'Details', icon: FaTags },
    { title: 'Image', icon: FaImage },
    { title: 'Review', icon: FaCheckCircle },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => {
    if (step === 1 && !formData.name.trim()) {
      setError('Item name is required');
      return;
    }
    if (step === 2 && (!formData.category.trim() || !formData.description.trim())) {
      setError('Category and description are required');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    payload.append('name', formData.name.trim());
    payload.append('category', formData.category.trim());
    payload.append('description', formData.description.trim());
    payload.append('ownership_type', formData.ownership_type);
    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      await itemService.createItem(payload);
      navigate('/browse');
    } catch (err) {
      setError(err.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="page-container py-12 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-display font-bold text-[#2f3b2b] mb-4">Add New Item</h1>
          <p className="text-[#56624e]">Share something special with your community</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-12 relative px-4">
          <div className="absolute top-6 left-0 w-full h-1 bg-[#d9e2c6] -z-0 rounded-full" />
          <div 
            className="absolute top-6 left-0 h-1 bg-[#3a5333] -z-0 transition-all duration-500 rounded-full" 
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />
          <div className="relative flex justify-between items-center z-10">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${
                    step > i + 1 
                      ? 'bg-[#3a5333] border-[#3a5333] text-white' 
                      : step === i + 1 
                        ? 'bg-white border-[#3a5333] text-[#3a5333]' 
                        : 'bg-white border-[#d9e2c6] text-[#d9e2c6]'
                  }`}
                >
                  <s.icon />
                </div>
                <span className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${step === i + 1 ? 'text-[#3a5333]' : 'text-[#8a997d]'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card max-w-2xl mx-auto p-10">
          {error && <div className="error-message">{error}</div>}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={step === 4 ? handleSubmit : (e) => e.preventDefault()} className="space-y-6">
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="form-group text-left">
                      <label className="form-label">What are you sharing?</label>
                      <input
                        type="text"
                        name="name"
                        className="input-base text-lg"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Vintage Film Camera"
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="form-group text-left">
                      <label className="form-label">Category</label>
                      <select
                        name="category"
                        className="input-base"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Books">Books</option>
                        <option value="Tools">Tools</option>
                        <option value="Home & Garden">Home & Garden</option>
                        <option value="Outdoors">Outdoors</option>
                        <option value="Toys">Toys</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group text-left">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        className="input-base min-h-[120px]"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Tell the community about your item..."
                        required
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="form-group text-left">
                      <label className="form-label">Add a Photo</label>
                      <div className="relative group">
                        <div className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-10 transition-all ${imagePreview ? 'border-[#3a5333] bg-[#f8fcf5]' : 'border-[#d9e2c6] hover:border-[#3a5333] bg-gray-50'}`}>
                          {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="max-h-64 rounded-lg shadow-sm" />
                          ) : (
                            <>
                              <FaCamera className="text-4xl text-[#d9e2c6] mb-4 group-hover:text-[#3a5333] transition-colors" />
                              <p className="text-[#56624e] font-medium">Click to upload or drag & drop</p>
                              <p className="text-xs text-[#8a997d] mt-2">JPG, PNG or GIF (max. 5MB)</p>
                            </>
                          )}
                          <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group text-left">
                      <label className="form-label">Listing Type</label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center transition-all ${formData.ownership_type === 'SELL' ? 'border-[#3a5333] bg-[#f8fcf5]' : 'border-[#d9e2c6] hover:border-[#3a5333]'}`}>
                          <input
                            type="radio"
                            name="ownership_type"
                            value="SELL"
                            className="hidden"
                            checked={formData.ownership_type === 'SELL'}
                            onChange={handleChange}
                          />
                          <span className="font-bold text-[#2f3b2b]">Sell</span>
                          <span className="text-xs text-[#56624e]">Permanent transfer</span>
                        </label>
                        <label className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center transition-all ${formData.ownership_type === 'BORROW' ? 'border-[#3a5333] bg-[#f8fcf5]' : 'border-[#d9e2c6] hover:border-[#3a5333]'}`}>
                          <input
                            type="radio"
                            name="ownership_type"
                            value="BORROW"
                            className="hidden"
                            checked={formData.ownership_type === 'BORROW'}
                            onChange={handleChange}
                          />
                          <span className="font-bold text-[#2f3b2b]">Borrow</span>
                          <span className="text-xs text-[#56624e]">Temporary lend</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-8 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {imagePreview && (
                        <div className="rounded-xl overflow-hidden shadow-sm">
                          <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-[#2f3b2b] mb-2">{formData.name}</h3>
                        <div className="flex gap-2 mb-4">
                          <span className="px-3 py-1 bg-[#d9e2c6] text-[#3a5333] text-[10px] font-bold rounded-full uppercase">{formData.category}</span>
                          <span className="px-3 py-1 bg-[#3a5333] text-[#f8f1da] text-[10px] font-bold rounded-full uppercase">{formData.ownership_type}</span>
                        </div>
                        <p className="text-[#56624e] text-sm leading-relaxed">{formData.description}</p>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex-shrink-0 flex items-center justify-center text-amber-600">
                        <FaCheckCircle />
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-800">Final Check</h4>
                        <p className="text-sm text-amber-700">Once you list this item, it will be visible to your community members.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-8 border-t border-[#f0ebe0]">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="btn btn-secondary flex items-center gap-2"
                    >
                      <FaChevronLeft /> Previous
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate('/browse')}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn btn-primary flex items-center gap-2"
                    >
                      Next <FaChevronRight />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      onClick={handleSubmit}
                      className="btn btn-primary min-w-[140px]"
                    >
                      {loading ? 'Creating...' : 'List Item Now'}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
