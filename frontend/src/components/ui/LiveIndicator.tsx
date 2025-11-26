import { motion } from 'framer-motion';

export default function LiveIndicator() {
  return (
    <div className="inline-flex items-center gap-2">
      <motion.div
        className="w-2 h-2 rounded-full bg-green-500"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <span className="text-sm font-semibold text-green-600">En Vivo</span>
    </div>
  );
}
