'use client';

import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function HeroSection() {
  const { authenticated } = useAuth();

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            <span className="block">Transform Your</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Productivity
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Experience the ultimate todo management with our cutting-edge application.
            Organize, prioritize, and achieve more with intuitive tools designed for success.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {!authenticated ? (
            <>
              <motion.a
                href="/auth/signup"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              >
                Get Started Free
              </motion.a>
              <motion.a
                href="/auth/login"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 text-lg"
              >
                Sign In
              </motion.a>
            </>
          ) : (
            <motion.a
              href="/dashboard"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
            >
              Go to Dashboard
            </motion.a>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20"
        >
          <div className="relative max-w-5xl mx-auto px-4">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-3xl animate-pulse"></div>

            {/* Floating orbs for depth */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl animate-bounce"></div>
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>

            {/* Main dashboard preview */}
            <div className="relative group">
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-cyan-400/20 group-hover:via-purple-400/20 group-hover:to-pink-400/20 rounded-3xl transition-all duration-500 blur-xl"></div>

              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1000' height='600' viewBox='0 0 1000 600'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%231e293b;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%230f172a;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1000' height='600' fill='url(%23grad1)' rx='24'/%3E%3C!-- Header --%3E%3Crect x='40' y='40' width='920' height='80' fill='%23334155' rx='12' opacity='0.6'/%3E%3Ccircle cx='80' cy='80' r='20' fill='%2306b6d4' opacity='0.8'/%3E%3Crect x='120' y='70' width='120' height='20' fill='%2364748b' rx='4'/%3E%3Crect x='860' y='65' width='80' height='30' fill='%2306b6d4' rx='15'/%3E%3C!-- Content cards --%3E%3Crect x='40' y='150' width='920' height='100' fill='%23475569' rx='16' opacity='0.4'/%3E%3Crect x='60' y='170' width='30' height='30' fill='%2306b6d4' rx='8'/%3E%3Crect x='110' y='175' width='300' height='20' fill='%2394a3b8' rx='4'/%3E%3Crect x='40' y='270' width='920' height='100' fill='%23334155' rx='16' opacity='0.5'/%3E%3Crect x='60' y='290' width='30' height='30' fill='%23a78bfa' rx='8'/%3E%3Crect x='110' y='295' width='400' height='20' fill='%2394a3b8' rx='4'/%3E%3Crect x='40' y='390' width='920' height='100' fill='%23475569' rx='16' opacity='0.4'/%3E%3Crect x='60' y='410' width='30' height='30' fill='%23ec4899' rx='8'/%3E%3Crect x='110' y='415' width='250' height='20' fill='%2394a3b8' rx='4'/%3E%3C!-- Accent elements --%3E%3Ccircle cx='920' cy='190' r='15' fill='%2306b6d4' opacity='0.3'/%3E%3Ccircle cx='920' cy='310' r='15' fill='%23a78bfa' opacity='0.3'/%3E%3Ccircle cx='920' cy='430' r='15' fill='%23ec4899' opacity='0.3'/%3E%3C/svg%3E"
                alt="Dashboard preview showcasing todo management interface"
                className="relative rounded-3xl shadow-2xl border border-white/20 w-full transform group-hover:scale-[1.02] transition-all duration-500 group-hover:shadow-cyan-500/50"
              />

              {/* Shimmer effect overlay */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
            </div>

            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-cyan-400/30 rounded-tl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-purple-400/30 rounded-br-3xl"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}