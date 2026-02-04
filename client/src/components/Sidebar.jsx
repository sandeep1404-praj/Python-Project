import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  FaHome, 
  FaInfoCircle, 
  FaShoppingBag, 
  FaBoxOpen, 
  FaChartLine, 
  FaClipboardList, 
  FaEnvelope, 
  FaKey,
  FaSignOutAlt,
  FaUser
} from 'react-icons/fa';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isStaff = user?.role === 'STAFF';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/browse', label: 'Browse', icon: FaBoxOpen },
    { to: '/dashboard', label: 'Dashboard', icon: FaChartLine },
    { to: '/borrow-requests', label: 'Requests', icon: FaClipboardList },
    { to: '/messages', label: 'Messages', icon: FaEnvelope },
  ];

  if (isStaff) {
    navLinks.push({ to: '/inspections', label: 'Staff Approval', icon: FaKey });
  }

  // Helper for class merging
  const cn = (...inputs) => twMerge(clsx(inputs));

  return (
    <div className="w-64 bg-white shadow-xl h-[calc(100vh-64px)] flex flex-col fixed left-0 top-16 z-40 border-r border-gray-100">
      {/* User Info Section */}
      <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <Link to="/profile" className="flex items-center gap-3 mb-2 hover:opacity-90 transition">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl font-bold shadow-sm">
            {user?.role === 'STAFF' ? <FaKey /> : <FaUser />}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-lg truncate">{user?.username}</p>
            <p className="text-xs text-blue-100 uppercase tracking-wide">
              {user?.role === 'STAFF' ? 'Staff Member' : 'Member'}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar">
        <div className="space-y-1 px-3">
            {navLinks.map((link) => (
            <Link
                key={link.to}
                to={link.to}
                className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                location.pathname === link.to
                    ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                )}
            >
                <link.icon className={cn(
                    "text-lg transition-colors",
                    location.pathname === link.to ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"
                )} />
                <span>{link.label}</span>
            </Link>
            ))}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 px-4 py-3 rounded-lg hover:bg-red-100 transition font-medium flex items-center justify-center gap-2 group"
        >
          <FaSignOutAlt className="group-hover:scale-110 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
