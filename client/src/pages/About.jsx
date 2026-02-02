import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">About Library Manager</h1>
          <p className="text-xl text-blue-100">Building a sustainable community through sharing and exchange</p>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-4">
              Library Manager is a community-driven platform designed to promote sustainable consumption and strengthen neighborhood connections. We believe that sharing is a powerful way to reduce waste, save money, and build stronger communities.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              Whether you want to sell, exchange, or share items, our platform makes it easy and rewarding to connect with your neighbors and extend the lifecycle of products.
            </p>
            <p className="text-lg text-gray-600">
              Every transaction earns you points that can be redeemed for rewards, turning community engagement into tangible benefits.
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-8 flex flex-col items-center justify-center">
            <div className="text-7xl mb-6">🌍</div>
            <p className="text-center text-gray-700 font-semibold text-lg">Sustainable Living, One Share at a Time</p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Community</h3>
              <p className="text-gray-700">
                We believe in the power of communities to solve problems together. By connecting neighbors, we create stronger, more resilient communities.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-8">
              <div className="text-5xl mb-4">♻️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Sustainability</h3>
              <p className="text-gray-700">
                Reducing waste and promoting circular economy principles. By sharing and exchanging items, we minimize environmental impact.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-8">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Trust & Transparency</h3>
              <p className="text-gray-700">
                Our staff verification process and rating system ensure quality and build trust between members of our community.
              </p>
            </div>
          </div>
        </div>

        {/* How We Work */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">How We Work</h2>
          <div className="bg-blue-50 rounded-lg p-8">
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">List Your Items</h3>
                  <p className="text-gray-700">
                    Create listings for items you want to sell, exchange, or share. Provide detailed descriptions, photos, and condition information.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Staff Verification</h3>
                  <p className="text-gray-700">
                    Our dedicated team reviews your items for quality, authenticity, and condition. Items receive a quality rating based on inspection.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Connect & Trade</h3>
                  <p className="text-gray-700">
                    Once approved, your items appear in our marketplace. Interested users can message you to negotiate and complete transactions.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Earn & Redeem Points</h3>
                  <p className="text-gray-700">
                    Earn points for every transaction. When items are sold, exchanged, or shared, both parties earn points that can be redeemed for rewards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="text-4xl">📦</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Multiple Listing Types</h3>
                <p className="text-gray-700">Sell, Exchange, or Share - choose what works best for you</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-4xl">⭐</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Quality Ratings</h3>
                <p className="text-gray-700">Staff-verified ratings help buyers and traders know what to expect</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-4xl">💬</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Direct Messaging</h3>
                <p className="text-gray-700">Communicate directly with buyers, sellers, and traders</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-4xl">🏆</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Reward Points</h3>
                <p className="text-gray-700">Earn points for each transaction and redeem for benefits</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-4xl">🔍</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Smart Search</h3>
                <p className="text-gray-700">Find items by category, location, and listing type</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-4xl">📍</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Location-Based</h3>
                <p className="text-gray-700">Connect with people in your area for easy transactions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reward System */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8 mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">How Our Reward System Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Earn Points By:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✅ Getting an item approved (+10 points)</li>
                <li>💰 Selling items (+20 points)</li>
                <li>🔄 Exchanging items (+15 points)</li>
                <li>🤝 Sharing items (+10 points)</li>
                <li>📦 Items being borrowed or taken (+15 points)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Redeem Points For:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>🎁 Exclusive community items</li>
                <li>💳 Account credits</li>
                <li>🎫 Discount coupons</li>
                <li>🌟 Premium features</li>
                <li>📚 Special badges and recognition</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Join Our Community Today</h2>
          <p className="text-lg text-gray-600 mb-8">
            Start sharing, buying, and selling with your neighbors. Earn points with every transaction!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/public-browse')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse Products
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Sign Up Now
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-800 text-white py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-2">Library Manager © 2024 - Promoting Sustainable Community Living</p>
          <p className="text-gray-400">Connecting neighbors, one item at a time</p>
        </div>
      </div>
    </div>
  );
}
