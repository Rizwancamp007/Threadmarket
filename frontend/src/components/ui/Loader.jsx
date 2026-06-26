import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <div className="flex flex-col items-center">
        {/* Brand Logo or Icon Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 border-t-2 border-r-2 border-electric rounded-full border-t-gold"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
          className="mt-6 text-pearl font-sans tracking-widest uppercase text-sm"
        >
          Loading ThreadMarket
        </motion.div>
      </div>
    </div>
  );
};

export default Loader;
