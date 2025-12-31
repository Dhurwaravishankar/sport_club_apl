import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export const SectionHeader = ({ title, subtitle, centered = true }: SectionHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${centered ? 'text-center' : ''}`}
    >
      <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className={`mt-6 h-1 w-24 bg-gradient-primary rounded-full ${centered ? 'mx-auto' : ''}`} />
    </motion.div>
  );
};
