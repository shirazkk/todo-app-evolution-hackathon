'use client';

import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  const { authenticated } = useAuth();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-white/20 text-center">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl md:text-4xl font-bold text-white">
                Ready to Transform Your Productivity?
              </CardTitle>
              <CardDescription className="text-lg text-slate-300">
                Join thousands of users who have revolutionized their workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white text-lg px-8 py-6 font-semibold shadow-xl"
              >
                <a href={!authenticated ? "/auth/signup" : "/dashboard"}>
                  <div className="flex items-center">
                    {!authenticated ? "Start Free Trial" : "Go to Dashboard"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}