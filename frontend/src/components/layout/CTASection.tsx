'use client';

import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function CTASection() {
  const { authenticated } = useAuth();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-12 border border-white/10"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of users who have revolutionized their workflow
          </p>
          <motion.a
            href={!authenticated ? "/auth/signup" : "/dashboard"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
          >
            {!authenticated ? "Start Free Trial" : "Go to Dashboard"}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}