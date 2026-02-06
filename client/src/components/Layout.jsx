import React from 'react';
import { useLocation } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import Navigation from './Navigation.jsx';
import Sidebar from './Sidebar.jsx';
import Footer from './Footer.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  // Define routes that should use the Sidebar (Management pages)
  const sidebarRoutes = ['/profile', '/dashboard', '/messages', '/borrow-requests', '/inspections', '/browse'];
  
  // Check if current path starts with any of the sidebar routes
  const showSidebar = user && sidebarRoutes.some(route => location.pathname.startsWith(route));
  
  return (
    <ReactLenis root>
      {/* Always show Top Navigation */}
      <Navigation />
      
      {showSidebar ? (
        // Management Layout: Sidebar + Content
        <div className="flex flex-col md:flex-row bg-[#fbf7ee] min-h-[calc(100vh-64px)] text-[#2f3b2b] selection:bg-[#d9e2c6] selection:text-[#2f3b2b]">
          <Sidebar />
          <main className="flex-1 w-full p-6 md:p-12">
            {children}
          </main>
        </div>
      ) : (
        // Public/Browsing Layout: Full Width Content
        <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[#fbf7ee] text-[#2f3b2b] selection:bg-[#d9e2c6] selection:text-[#2f3b2b]">
            <main className="flex-grow w-full">
                {children}
            </main>
            
            <Footer />
        </div>
      )}
    </ReactLenis>
  );
}
