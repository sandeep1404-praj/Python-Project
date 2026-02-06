import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(username, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Login failed');
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
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#d9e2c6] rounded-full blur-[120px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#3a5333] rounded-full blur-[120px] opacity-20"></div>

      <div className="card w-full max-w-md p-10 bg-white/80 backdrop-blur-xl border border-[#f0ebe0] relative z-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-display font-bold text-[#2f3b2b] mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-[#56624e] font-medium italic">"Re-use, Re-love, Re-connect"</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm animate-shake">
            <p className="font-bold flex items-center gap-2">
              <span className="text-lg">⚠️</span> {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="form-label text-[10px] uppercase tracking-widest text-[#8a997d]">Account Handle</label>
            <input
              type="text"
              className="input-base bg-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label text-[10px] uppercase tracking-widest text-[#8a997d]">Security Key</label>
            <input
              type="password"
              className="input-base bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-[#3a5333]/30"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-[#fbf7ee] text-center">
          <p className="text-[#56624e] text-sm">
            New to the community?{' '}
            <Link to="/register" className="text-[#3a5333] font-bold hover:underline decoration-2 underline-offset-4">
              Join us here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
