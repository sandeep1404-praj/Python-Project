import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookOpen, FaHeart, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#26301e] text-[#f8f1da]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10 text-left">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 min-w-10 rounded-xl bg-[#f8f1da] text-[#2f3b2b] flex items-center justify-center">
              <FaBookOpen />
            </div>
            <div className="font-display text-xl">Library of Things</div>
          </div>
          <p className="mt-4 text-sm text-[#d4d9c8]">
            A community platform for sharing, exchanging, and selling items locally.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-[#d4d9c8]">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/products" className="hover:text-white">Browse Items</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg">Community</h4>
          <ul className="mt-4 space-y-2 text-sm text-[#d4d9c8]">
            <li><Link to="/about" className="hover:text-white">How It Works</Link></li>
            <li><Link to="/about" className="hover:text-white">Guidelines</Link></li>
            <li><Link to="/about" className="hover:text-white">Safety Tips</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg">Stay Connected</h4>
          <p className="mt-4 text-sm text-[#d4d9c8]">Join our community and get updates on new items.</p>
          <div className="mt-4 flex gap-3">
            <button className="h-10 w-10 rounded-full bg-[#f8f1da] text-[#2f3b2b] flex items-center justify-center hover:bg-white transition-colors">
              <FaHeart />
            </button>
            <button className="h-10 w-10 rounded-full bg-[#f8f1da] text-[#2f3b2b] flex items-center justify-center hover:bg-white transition-colors">
              <FaEnvelope />
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-[#3b462f] py-6 text-center text-xs text-[#c3c9b5]">
        &copy; {new Date().getFullYear()} Library of Things. Built with care for our community.
      </div>
    </footer>
  );
}
