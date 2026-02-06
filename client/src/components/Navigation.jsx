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
    { to: '/messages', label: 'New Message', icon: FaEnvelope, public: false, hidden: true },
  ];

  // Filter links based on auth state
  const visibleLinks = navLinks.filter(link => {
    if (link.hidden) return false;
    if (link.public) return true;
    if (link.protected && token) return true;
    return false;
  });

  // Helper for class merging
  const cn = (...inputs) => twMerge(clsx(inputs));

  return (
    <nav className="sticky top-0 z-50 bg-[#fbf7ee]/90 backdrop-blur-md border-b border-[#ede2c1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <span className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-[#3a5333] text-[#f8f1da]">
              <FaBookOpen />
            </span>
            <span className="font-display text-xl text-[#2f3b2b]">
              Library of Things
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {visibleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex items-center gap-2",
                  location.pathname === link.to
                    ? "bg-[#e9dfbf] text-[#2f3b2b]"
                    : "text-[#4f5e45] hover:bg-[#f1e7c7]"
                )}
              >
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
                      ? "bg-[#e9dfbf] text-[#2f3b2b] ring-2 ring-[#efe5c8]" 
                      : "hover:bg-[#f1e7c7] text-[#3b4a33]"
                  )}
                  title="Profile"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#6b7b57] to-[#3a5333] rounded-full flex items-center justify-center text-white text-sm shadow-md">
                    {user?.role === 'STAFF' ? <FaKey /> : <FaUser />}
                  </div>
                  <span className="font-medium max-w-[100px] truncate">{user?.username}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#7a8b65] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Logout"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[#4f5e45] hover:text-[#2f3b2b] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-semibold text-[#f8f1da] bg-[#3a5333] hover:bg-[#31462b] rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#4f5e45] hover:text-[#2f3b2b] p-2 focus:outline-none"
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
            className="md:hidden bg-[#fbf7ee] border-b border-[#ede2c1] overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {visibleLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-colors",
                    location.pathname === link.to
                      ? "bg-[#e9dfbf] text-[#2f3b2b]"
                      : "text-[#4f5e45] hover:bg-[#f1e7c7]"
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth Section */}
                <div className="mt-4 pt-4 border-t border-[#ede2c1]">
                {token ? (
                    <>
                    <Link
                        to="/profile"
                    className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-[#4f5e45] hover:bg-[#f1e7c7]"
                    >
                    <div className="w-6 h-6 bg-gradient-to-br from-[#6b7b57] to-[#3a5333] rounded-full flex items-center justify-center text-white text-xs">
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
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-[#c9b98d] rounded-full text-[#4f5e45] font-medium hover:bg-[#f1e7c7]"
                        >
                            <FaSignInAlt /> Log In
                        </Link>
                        <Link
                            to="/register"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#3a5333] text-[#f8f1da] rounded-full font-medium hover:bg-[#31462b]"
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
