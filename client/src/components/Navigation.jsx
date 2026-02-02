import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isStaff = user?.role === 'STAFF';

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl">📚</span>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hidden sm:inline">
              Library Manager
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-4 overflow-x-auto">
            <Link to="/" className="text-gray-700 hover:text-purple-600 font-medium transition whitespace-nowrap">
              Home
            </Link>

            <Link to="/about" className="text-gray-700 hover:text-purple-600 font-medium transition whitespace-nowrap">
              About
            </Link>

            <Link to="/public-browse" className="text-gray-700 hover:text-purple-600 font-medium transition whitespace-nowrap">
              Products
            </Link>

            <Link to="/browse" className="text-gray-700 hover:text-purple-600 font-medium transition whitespace-nowrap">
              My Items
            </Link>

            <Link to="/dashboard" className="text-gray-700 hover:text-purple-600 font-medium transition whitespace-nowrap">
              Dashboard
            </Link>

            <Link
              to="/borrow-requests"
              className="text-gray-700 hover:text-purple-600 font-medium transition whitespace-nowrap"
            >
              Requests
            </Link>

            <Link
              to="/messages"
              className="text-gray-700 hover:text-purple-600 font-medium transition whitespace-nowrap"
            >
              Messages
            </Link>

            {isStaff && (
              <Link
                to="/inspections"
                className="text-yellow-700 hover:text-yellow-800 font-bold transition bg-yellow-100 px-3 py-1 rounded whitespace-nowrap"
              >
                🔍 Staff
              </Link>
            )}

            {/* User Menu */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <Link to="/profile" className="text-right hover:text-purple-600 transition">
                <p className="text-sm font-semibold text-gray-800">{user?.username}</p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'STAFF' ? '🔑 Staff' : '👤 Member'}
                </p>
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm font-medium whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-purple-600"
          >
            <span className="text-2xl">☰</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-4">
            <Link to="/" className="block text-gray-700 hover:text-purple-600 font-medium transition">
              Home
            </Link>
            <Link to="/about" className="block text-gray-700 hover:text-purple-600 font-medium transition">
              About
            </Link>
            <Link to="/public-browse" className="block text-gray-700 hover:text-purple-600 font-medium transition">
              Products
            </Link>
            <Link to="/browse" className="block text-gray-700 hover:text-purple-600 font-medium transition">
              My Items
            </Link>
            <Link to="/dashboard" className="block text-gray-700 hover:text-purple-600 font-medium transition">
              Dashboard
            </Link>
            <Link to="/borrow-requests" className="block text-gray-700 hover:text-purple-600 font-medium transition">
              Requests
            </Link>
            <Link to="/messages" className="block text-gray-700 hover:text-purple-600 font-medium transition">
              Messages
            </Link>
            {isStaff && (
              <Link to="/inspections" className="block text-yellow-700 hover:text-yellow-800 font-bold transition bg-yellow-100 px-3 py-1 rounded">
                🔍 Staff Approval
              </Link>
            )}
            <Link to="/profile" className="block text-gray-700 hover:text-purple-600 font-medium transition">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
