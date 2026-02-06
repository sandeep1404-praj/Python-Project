import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData.username, formData.email, formData.password);
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#d9e2c6] rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-[#3a5333] rounded-full blur-[120px] opacity-20 animate-pulse"></div>

      <div className="card w-full max-w-lg p-10 bg-white/80 backdrop-blur-xl border border-[#f0ebe0] relative z-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-display font-bold text-[#2f3b2b] mb-2 tracking-tight">Join Our Circle</h1>
          <p className="text-[#56624e] font-medium italic">"Every shared item tells a story"</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            <p className="font-bold flex items-center gap-2">
              <span className="text-lg">⚠️</span> {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group md:col-span-1">
            <label className="form-label text-[10px] uppercase tracking-widest text-[#8a997d]">Chosen Name</label>
            <input
              type="text"
              name="username"
              className="input-base bg-white"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </div>

          <div className="form-group md:col-span-1">
            <label className="form-label text-[10px] uppercase tracking-widest text-[#8a997d]">Email Address</label>
            <input
              type="email"
              name="email"
              className="input-base bg-white"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>

          <div className="form-group md:col-span-1">
            <label className="form-label text-[10px] uppercase tracking-widest text-[#8a997d]">Security Key</label>
            <input
              type="password"
              name="password"
              className="input-base bg-white"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group md:col-span-1">
            <label className="form-label text-[10px] uppercase tracking-widest text-[#8a997d]">Repeat Key</label>
            <input
              type="password"
              name="confirmPassword"
              className="input-base bg-white"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 transform hover:scale-[1.01] shadow-xl hover:shadow-[#3a5333]/30"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Building profile...
                </span>
              ) : 'Create Your Account'}
            </button>
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-[#fbf7ee] text-center">
          <p className="text-[#56624e] text-sm">
            Already a member?{' '}
            <Link to="/login" className="text-[#3a5333] font-bold hover:underline decoration-2 underline-offset-4">
              Step inside here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
