import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const FAQ = () => {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-transparent">
      <SEO title="FAQs | ThreadMarket" />
      <div className="max-w-3xl mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display text-pearl mb-10 text-center"
        >
          Frequently Asked Questions
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 font-sans"
        >
          {[
            { q: "Do you ship internationally?", a: "Currently, we only ship within Pakistan. We plan to expand globally soon." },
            { q: "How long does delivery take?", a: "Standard delivery takes 3-5 business days. Bridal wear may take up to 4 weeks." },
            { q: "Is Cash on Delivery available?", a: "Yes, COD is available for orders under Rs. 50,000." }
          ].map((faq, i) => (
            <div key={i} className="bg-midnight/50 backdrop-blur-md p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-medium text-pearl mb-2">{faq.q}</h3>
              <p className="text-gray-400">{faq.a}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
