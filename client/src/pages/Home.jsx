import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import {
  FaBookOpen,
  FaBook,
  FaTools,
  FaLaptop,
  FaHome,
  FaSearch,
  FaRecycle,
  FaDollarSign,
  FaUsers,
  FaLeaf,
  FaShieldAlt,
  FaArrowRight,
  FaHeart,
  FaEnvelope
} from 'react-icons/fa';

export default function Home() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const categories = [
    { title: 'Books', count: '150+ items', icon: FaBook },
    { title: 'Tools', count: '80+ items', icon: FaTools },
    { title: 'Electronics', count: '120+ items', icon: FaLaptop },
    { title: 'Home & Garden', count: '200+ items', icon: FaHome }
  ];

  const steps = [
    {
      title: 'Browse Items',
      desc: 'Explore our community catalog of available items.',
      icon: FaSearch
    },
    {
      title: 'Share or Exchange',
      desc: 'Connect with neighbors to borrow or trade.',
      icon: FaRecycle
    },
    {
      title: 'Buy or Sell',
      desc: 'Purchase items or list yours for sale.',
      icon: FaDollarSign
    }
  ];

  const values = [
    {
      title: 'Community Driven',
      desc: 'Built by neighbors, for neighbors. Join a growing community of sharers.',
      icon: FaUsers
    },
    {
      title: 'Sustainable Living',
      desc: 'Reduce waste and save money by sharing resources locally.',
      icon: FaLeaf
    },
    {
      title: 'Safe & Secure',
      desc: 'Verified users and clear guidelines keep everyone safe.',
      icon: FaShieldAlt
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
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const primaryCta = token ? '/browse' : '/register';

  return (
    <div className="bg-[#fbf7ee] text-[#2f3b2b]">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf7ee] via-[#f8f1da] to-[#f3e6c5]">
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[#d9e2c6] opacity-50 blur-3xl" />
        <div className="absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-[#e5d6a8] opacity-60 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-[#5a6b4b] mb-4">Library of Things</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight text-[#2f3b2b]">
              Share, Exchange, and Sell Your Product
            </h1>
            <p className="mt-6 text-lg text-[#56624e] max-w-xl">
              Join the Library of Things where neighbors connect to share resources, reduce waste, and build a more sustainable community together.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center gap-3 rounded-full bg-[#3a5333] px-6 py-3 text-[#f8f1da] font-semibold shadow-lg shadow-[#3a5333]/20 hover:translate-y-[-1px] hover:bg-[#31462b] transition"
              >
                Browse Items <FaArrowRight />
              </button>
              <button
                onClick={() => navigate('/about')}
                className="inline-flex items-center gap-3 rounded-full border border-[#6c7a5a] px-6 py-3 text-[#3a5333] font-semibold hover:bg-[#f3e6c5] transition"
              >
                Learn More
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-[#3a5333] to-[#7a8b65] opacity-20 blur-2xl" />
            <div className="relative rounded-[28px] overflow-hidden shadow-2xl shadow-[#2f3b2b]/20 border border-[#e8ddbc] bg-[#fdf9ef]">
              <img
                src="landing.png"
                alt="Neighbor sharing books"
                className="h-[360px] w-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="font-display text-3xl sm:text-4xl text-[#2f3b2b]">Browse by Category</h2>
            <p className="mt-3 text-[#6a765a]">Find what you need in our diverse collection</p>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((category) => (
              <motion.div
                key={category.title}
                variants={itemVariants}
                className="rounded-2xl border border-[#e8ddbc] bg-[#fbf4df] p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#7a4d1d] shadow">
                  <category.icon className="text-xl" />
                </div>
                <h3 className="font-display text-xl mt-6 text-[#2f3b2b]">{category.title}</h3>
                <p className="mt-2 text-sm text-[#6a765a]">{category.count}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-[#f6edd2]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="font-display text-3xl sm:text-4xl text-[#2f3b2b]">How It Works</h2>
            <p className="mt-3 text-[#6a765a]">Getting started is simple and free</p>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {steps.map((step) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                className="text-center"
              >
                <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#3a5333] text-[#f8f1da] shadow-lg">
                  <step.icon className="text-2xl" />
                </div>
                <h3 className="font-display text-2xl text-[#2f3b2b]">{step.title}</h3>
                <p className="mt-3 text-[#6a765a]">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-[#fbf7ee]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                className="rounded-2xl bg-[#fff8e7] border border-[#e8ddbc] p-8 shadow-sm"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#f2e3c1] text-[#8a5a2c]">
                  <value.icon />
                </div>
                <h3 className="font-display text-2xl text-[#2f3b2b] mt-6">{value.title}</h3>
                <p className="mt-3 text-[#6a765a]">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#2f3b2b] via-[#38492f] to-[#2b3723]">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-20 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-[#f8f1da]">Ready to Join the Community?</h2>
          <p className="mt-4 text-[#d9e2c6]">Start sharing, exchanging, and selling today. It is free to join.</p>
          <button
            onClick={() => navigate(primaryCta)}
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#c57a32] px-8 py-3 text-white font-semibold shadow-lg shadow-[#1f2819]/30 hover:bg-[#b56c2a] transition"
          >
            Get Started Now <FaArrowRight />
          </button>
        </div>
      </section>
    </div>
  );
}

