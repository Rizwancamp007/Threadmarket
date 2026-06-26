import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const About = () => {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <SEO title="Our Story | ThreadMarket" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-display text-pearl mb-6">
            The <span className="text-gold italic">Legacy</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-crimson to-transparent mx-auto mb-10"></div>
        </motion.div>

        <div className="space-y-8 text-gray-300 font-sans text-lg md:text-xl leading-relaxed relative">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            ThreadMarket was born from a singular vision: to bridge the gap between traditional Pakistani craftsmanship and modern, high-end digital luxury.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            We curate the finest fabrics, the most intricate embroideries, and the most visionary designers in the country, bringing them to a global audience under one seamless, premium platform.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, rotateX: -90 }}
            whileInView={{ opacity: 1, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 1, ease: "backOut" }}
            className="my-16 perspective-1000"
          >
            <div className="p-10 border border-white/10 bg-midnight/50 backdrop-blur-md rounded-2xl shadow-[0_0_50px_rgba(198,168,75,0.1)]">
              <h3 className="text-2xl text-electric font-display mb-4">Our Commitment</h3>
              <p className="text-sm tracking-widest uppercase text-pearl">Quality • Authenticity • Excellence</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
