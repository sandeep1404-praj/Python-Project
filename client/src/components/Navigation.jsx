import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaInfoCircle, 
  FaShoppingBag, 
  FaBoxOpen, 
  FaChartLine, 
  FaClipboardList, 
  FaEnvelope, 
  FaUser, 
  FaKey, 
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaBookOpen
} from 'react-icons/fa';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Navigation() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: FaHome, public: true },
    { to: '/about', label: 'About', icon: FaInfoCircle, public: true },
    { to: '/products', label: 'Products', icon: FaShoppingBag, public: true },
  ];

  // Filter links based on auth state
  const visibleLinks = navLinks.filter(link => {
    if (link.public) return true;
    if (link.protected && token) return true;
    return false;
  });

  // Helper for class merging
  const cn = (...inputs) => twMerge(clsx(inputs));

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Library Manager
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {visibleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2",
                  location.pathname === link.to
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side (Auth) */}
          <div className="hidden md:flex items-center gap-3">
            {token ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <button
                  onClick={() => navigate('/profile')}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200",
                    location.pathname === '/profile' 
                      ? "bg-blue-50 text-blue-600 ring-2 ring-blue-100" 
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                  title="Profile"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm shadow-md">
                    {user?.role === 'STAFF' ? <FaKey /> : <FaUser />}
                  </div>
                  <span className="font-medium max-w-[100px] truncate">{user?.username}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Logout"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 p-2 focus:outline-none"
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {visibleLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-colors",
                    location.pathname === link.to
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                {token ? (
                    <>
                    <Link
                        to="/profile"
                        className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                    >
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                         {user?.role === 'STAFF' ? <FaKey /> : <FaUser />}
                        </div>
                        <span>Profile ({user?.username})</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                    >
                        <FaSignOutAlt className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                    </>
                ) : (
                    <div className="grid grid-cols-2 gap-3 px-3">
                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                        >
                            <FaSignInAlt /> Log In
                        </Link>
                        <Link
                            to="/register"
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                        >
                            <FaUserPlus /> Sign Up
                        </Link>
                    </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
