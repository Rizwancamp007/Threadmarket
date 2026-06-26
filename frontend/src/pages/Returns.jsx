import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const Returns = () => {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-transparent">
      <SEO title="Returns & Exchanges | ThreadMarket" />
      <div className="max-w-3xl mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display text-pearl mb-10 text-center"
        >
          Returns & Exchanges
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8 text-gray-300 font-sans"
        >
          <div className="bg-midnight/50 backdrop-blur-md p-8 rounded-2xl border border-white/10">
            <h3 className="text-xl font-display text-gold mb-3">Our Policy</h3>
            <p>We accept returns within 14 days of delivery. Items must be unworn, unwashed, and have original tags attached.</p>
          </div>
          <div className="bg-midnight/50 backdrop-blur-md p-8 rounded-2xl border border-white/10">
            <h3 className="text-xl font-display text-electric mb-3">How to Return</h3>
            <p>Please contact support@threadmarket.com with your order token. We will arrange a courier pickup from your address.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Returns;
