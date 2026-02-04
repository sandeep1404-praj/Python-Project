import React from 'react';
import { useLocation } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import Navigation from './Navigation.jsx';
import Sidebar from './Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  // Define routes that should use the Sidebar (Management pages)
  const sidebarRoutes = ['/profile', '/dashboard', '/messages', '/borrow-requests', '/inspections'];
  
  // Check if current path starts with any of the sidebar routes
  const showSidebar = user && sidebarRoutes.some(route => location.pathname.startsWith(route));
  
  return (
    <ReactLenis root>
      {/* Always show Top Navigation */}
      <Navigation />
      
      {showSidebar ? (
        // Management Layout: Sidebar + Content
        <div className="flex bg-gray-50 min-h-[calc(100vh-64px)] font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
          <Sidebar />
          <main className="flex-1 ml-64 w-full p-6">
            {children}
          </main>
        </div>
      ) : (
        // Public/Browsing Layout: Full Width Content
        <div className="flex flex-col min-h-[calc(100vh-64px)] bg-gray-50 font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
            <main className="flex-grow w-full">
                {children}
            </main>
            
            {/* Simple Footer */}
            <footer className="bg-white border-t border-gray-100 py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Library Manager. All rights reserved.</p>
                </div>
            </footer>
        </div>
      )}
    </ReactLenis>
  );
}
