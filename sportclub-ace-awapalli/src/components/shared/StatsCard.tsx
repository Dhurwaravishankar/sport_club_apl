import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  index?: number;
}

export const StatsCard = ({ icon: Icon, value, label, index = 0 }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gradient-card rounded-xl p-6 border border-border text-center shadow-card hover:border-primary/50 transition-all group"
    >
      <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <div className="font-heading text-4xl text-foreground mb-2">{value}</div>
      <div className="text-muted-foreground text-sm uppercase tracking-wider">{label}</div>
    </motion.div>
  );
};
