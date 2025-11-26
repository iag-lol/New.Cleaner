import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  gradient?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'none';
  hover?: boolean;
  glow?: boolean;
}

export default function Card({ children, className, gradient = 'none', hover = false, glow = false }: CardProps) {
  const gradientClasses = {
    primary: 'bg-gradient-primary text-white',
    success: 'bg-gradient-success text-white',
    warning: 'bg-gradient-warning text-white',
    danger: 'bg-gradient-danger text-white',
    info: 'bg-gradient-info text-white',
    none: 'bg-white',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={clsx(
        'rounded-xl p-6 shadow-card',
        gradientClasses[gradient],
        hover && 'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer',
        glow && gradient === 'primary' && 'shadow-glow-primary',
        glow && gradient === 'success' && 'shadow-glow-success',
        glow && gradient === 'warning' && 'shadow-glow-warning',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
