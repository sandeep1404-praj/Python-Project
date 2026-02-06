import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowRight, 
  FaHeart, 
  FaLeaf, 
  FaGlobe, 
  FaUsers,
  FaCheckCircle,
  FaExchangeAlt,
  FaHandshake,
  FaCoins,
  FaTrophy,
  FaGift
} from 'react-icons/fa';

export default function About() {
  const navigate = useNavigate();

  const impactStats = [
    { label: 'Active Members', value: '5,000+' },
    { label: 'Items Shared', value: '12,000+' },
    { label: 'Local Communities', value: '50+' },
    { label: 'Satisfaction Rate', value: '95%' },
  ];

  const values = [
    {
      title: 'Community First',
      desc: 'We believe in the power of neighbors helping neighbors. Our platform is built on trust, respect, and mutual support.',
      icon: FaHeart
    },
    {
      title: 'Sustainability',
      desc: 'By sharing and reusing items, we reduce waste and our environmental impact. Every transaction helps build a greener future.',
      icon: FaLeaf
    },
    {
      title: 'Accessibility',
      desc: 'Everyone should have access to the tools and resources they need. We make it easy and affordable for all.',
      icon: FaUsers
    },
    {
      title: 'Local Impact',
      desc: 'Strengthen local connections and support your community economy by keeping resources circulating locally.',
      icon: FaGlobe
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-[#fbf7ee] text-[#2f3b2b] pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-display text-5xl lg:text-7xl leading-tight text-[#2f3b2b] mb-8">
            Building a More Connected Community
          </h1>
          <p className="text-lg text-[#56624e] max-w-xl mb-10 leading-relaxed">
            The Library of Things is more than a marketplace – it's a movement towards sustainable, community-driven living. We connect neighbors to share resources, reduce waste, and build meaningful relationships.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-3 rounded-full bg-[#3a5333] px-8 py-4 text-[#f8f1da] font-semibold shadow-lg hover:bg-[#31462b] transition-all"
          >
            Explore Items <FaArrowRight />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="rounded-[32px] overflow-hidden shadow-2xl border-8 border-white bg-white">
            <img
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80"
              alt="Community Library"
              className="w-full h-[450px] object-cover"
            />
          </div>
        </motion.div>
      </section>

      {/* Our Impact Section */}
      <section className="bg-white py-24 mb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-[#2f3b2b] mb-4">Our Impact</h2>
          <p className="text-[#6a765a] text-lg mb-16">Together, we're making a real difference</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {impactStats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="font-display text-4xl lg:text-5xl text-[#c57a32] mb-3">{stat.value}</div>
                <div className="text-sm font-semibold uppercase tracking-wider text-[#5a6b4b]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl text-[#2f3b2b] mb-4">Our Values</h2>
          <p className="text-[#6a765a]">The principles that guide everything we do</p>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl shadow-sm border border-[#ede2c1] hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-xl bg-[#3a5333] text-white flex items-center justify-center mb-6">
                <value.icon className="text-xl" />
              </div>
              <h3 className="font-display text-2xl text-[#2f3b2b] mb-4">{value.title}</h3>
              <p className="text-[#56624e] leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Point System Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <div className="bg-[#2f3b2b] rounded-[40px] overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c57a32] opacity-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3a5333] opacity-20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative z-10 p-10 lg:p-20">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c57a32]/20 text-[#e8a361] text-xs font-bold uppercase tracking-widest mb-6">
                <FaTrophy /> Rewards Program
              </span>
              <h2 className="font-display text-4xl lg:text-5xl text-[#f8f1da] mb-6">The Community Point System</h2>
              <p className="text-[#c3c9b5] max-w-2xl mx-auto text-lg leading-relaxed">
                We reward your commitment to sustainability. Every interaction earns you points that reflect your positive impact on the community.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl">
                <h3 className="text-[#f8f1da] font-display text-2xl mb-8 flex items-center gap-3">
                  <span className="text-[#c57a32]"><FaCoins /></span> Earn Points By
                </h3>
                <div className="space-y-6">
                  {[
                    { action: 'Get an item approved', points: '+10', icon: FaCheckCircle },
                    { action: 'Sell an item', points: '+20', icon: FaCoins },
                    { action: 'Exchange an item', points: '+15', icon: FaExchangeAlt },
                    { action: 'Share an item', points: '+10', icon: FaHandshake },
                    { action: 'Item being borrowed', points: '+15', icon: FaArrowRight },
                  ].map((item) => (
                    <div key={item.action} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#d4d9c8] group-hover:scale-110 transition-transform">
                          <item.icon className="text-sm" />
                        </div>
                        <span className="text-[#d4d9c8] font-medium">{item.action}</span>
                      </div>
                      <span className="text-[#c57a32] font-display text-xl bold">{item.points}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl">
                <h3 className="text-[#f8f1da] font-display text-2xl mb-8 flex items-center gap-3">
                  <span className="text-[#c57a32]"><FaGift /></span> Redeem Points For
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    'Exclusive community items',
                    'Account credits',
                    'High-value discount coupons',
                    'Premium platform features',
                    'Special recognition badges',
                    'Community event access'
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-[#c57a32]/30 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-[#c57a32]"></div>
                      <span className="text-[#d4d9c8] text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <p className="text-[#c3c9b5] text-sm italic mb-8">Points are calculated automatically after each verified transaction.</p>
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-3 rounded-full bg-[#c57a32] px-10 py-4 text-white font-bold shadow-lg hover:bg-[#b56c2a] transition-all"
              >
                Start Earning Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="order-2 lg:order-1"
        >
          <div className="rounded-[40px] overflow-hidden shadow-2xl relative">
            <img
              src="about.png"
              alt="Neighbors shaking hands"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="order-1 lg:order-2 text-left"
        >
          <h2 className="font-display text-5xl text-[#2f3b2b] mb-8">Our Story</h2>
          <div className="space-y-6 text-lg text-[#56624e] leading-relaxed">
            <p>
              Library of Things was born from a simple idea: what if we could access what we need without owning everything? Started in 2023 by a group of neighbors who wanted to reduce waste and build community, we've grown into a thriving network of sharers, exchangers, and sellers.
            </p>
            <p>
              Today, thousands of members across multiple communities use our platform to borrow tools, exchange books, sell unused items, and most importantly – connect with their neighbors in meaningful ways.
            </p>
            <p>
              We are committed to building a world where sharing is the first choice, protecting our planet while bringing people closer together.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
