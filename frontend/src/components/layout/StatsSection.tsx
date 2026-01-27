'use client';
import { motion } from "framer-motion";
export default function StatsSection() {
  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "5M+", label: "Tasks Completed" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary text-white bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-muted-foreground mt-2 text-white">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
