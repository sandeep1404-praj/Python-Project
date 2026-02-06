import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, 
  FaInfoCircle, 
  FaBoxOpen, 
  FaChartLine, 
  FaClipboardList, 
  FaEnvelope, 
  FaKey,
  FaSignOutAlt,
  FaUser,
  FaBars,
  FaTimes,
  FaChevronRight
} from 'react-icons/fa';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isStaff = user?.role === 'STAFF';
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/profile', label: 'My Profile', icon: FaUser },
    { to: '/browse', label: 'Resource Catalog', icon: FaBoxOpen },
    { to: '/dashboard', label: 'Inventory Hub', icon: FaChartLine },
    { to: '/borrow-requests', label: 'Request Journal', icon: FaClipboardList },
    { to: '/messages', label: 'New Message', icon: FaEnvelope, hidden: true },
  ];

  if (isStaff) {
    navLinks.push({ to: '/inspections', label: 'Curator Panel', icon: FaKey });
  }

  const cn = (...inputs) => twMerge(clsx(inputs));

  const SidebarContent = ({ isMobile = false }) => (
    <div className={cn(
      "flex flex-col h-full overflow-hidden",
      isMobile ? "bg-stone-900 text-white" : "bg-white/40"
    )}>
      {/* User Identity Section */}
      <div className="p-6">
        <Link to="/profile" onClick={() => isMobile && setIsMobileOpen(false)} className="block group">
          <div className={cn(
            "relative p-2 rounded-[2rem] overflow-hidden transition-all duration-500",
            isMobile ? "bg-white/5 border border-white/10" : "bg-stone-900 shadow-xl"
          )}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className={cn(
                  "w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-xl font-black shadow-2xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110",
                  isMobile ? "bg-white/10 text-white" : "bg-[#d9e2c6] text-stone-900 border border-white/20"
                )}>
                  {user?.username ? user.username.charAt(0).toUpperCase() : <FaUser />}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-stone-900"></div>
              </div>
              <div className="w-full">
                <h3 className={cn(
                  "font-display font-bold tracking-tight text-lg truncate",
                  isMobile ? "text-white" : "text-[#d9e2c6]"
                )}>
                  {user?.username}
                </h3>
                <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.15em] text-white/40">
                  {isStaff ? 'Archivist' : 'Steward'}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 overflow-y-auto custom-scrollbar">
        <div className="space-y-1.5">
          {navLinks.filter(link => !link.hidden).map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => isMobile && setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative",
                  isActive
                    ? (isMobile ? "bg-white text-stone-900 font-bold" : "bg-white text-stone-900 font-bold shadow-md border border-stone-100")
                    : (isMobile ? "text-stone-400 hover:bg-white/5 hover:text-white" : "text-stone-500 hover:bg-stone-900/5 hover:text-stone-900")
                )}
              >
                <link.icon className={cn(
                  "text-lg transition-all duration-300",
                  isActive ? "scale-110" : "opacity-70 group-hover:scale-110 group-hover:opacity-100"
                )} />
                <span className="text-sm font-medium tracking-tight flex-1">{link.label}</span>
                {isActive && !isMobile && (
                  <motion.div layoutId="desktop-pill" className="absolute left-0 w-1 h-6 bg-stone-900 rounded-r-full" />
                )}
                {isMobile && <FaChevronRight size={10} className={cn("transition-transform", isActive ? "rotate-90" : "opacity-30")} />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="p-6 border-t border-white/5 mt-auto">
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all",
            isMobile ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-red-50 text-red-600 hover:bg-red-100"
          )}
        >
          <FaSignOutAlt />
          <span>Exit Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button (Floating) */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed bottom-8 right-8 w-14 h-14 bg-stone-900 text-white rounded-2xl shadow-2xl flex items-center justify-center z-50 border border-white/10 animate-in zoom-in duration-500"
      >
        <FaBars size={20} />
      </button>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-y-0 left-0 w-[85%] max-w-[320px] bg-stone-900 z-[70] shadow-2xl"
            >
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white"
              >
                <FaTimes />
              </button>
              <SidebarContent isMobile={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Premium Floating Aesthetic */}
      <div className="hidden md:flex w-[280px] bg-white/40 backdrop-blur-3xl h-[calc(100vh-120px)] flex-col fixed left-8 top-28 z-40 border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[2.5rem] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden">
        <SidebarContent />
      </div>

      {/* Layout Spacer */}
      <div className="hidden md:block w-[280px] ml-8" />
    </>
  );
}
