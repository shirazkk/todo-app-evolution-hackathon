'use client';

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import HeroSection from '../components/layout/HeroSection';
import FeaturesSection from '../components/layout/FeaturesSection';
import CTASection from '../components/layout/CTASection';

export default function Home() {
  const { authenticated } = useAuth();

  useEffect(() => {
    // Add subtle background animation
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      document.documentElement.style.setProperty('--mouse-x', x.toString());
      document.documentElement.style.setProperty('--mouse-y', y.toString());
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Main content */}
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </div>
    </div>
  );
}
