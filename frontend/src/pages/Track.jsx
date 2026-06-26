import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';

const Track = () => {
  const [token, setToken] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    if (!token.trim()) return;
    setIsLoading(true);
    setError('');
    setResult(null);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/track/${token}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Order not found');
      }
      
      setResult({
        status: data.status,
        date: new Date(data.createdAt).toLocaleDateString(),
        address: `${data.shippingAddress.address}, ${data.shippingAddress.city}, ${data.shippingAddress.country}`
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-transparent">
      <SEO title="Track Order | ThreadMarket" />
      <div className="max-w-3xl mx-auto px-4 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display text-pearl mb-6"
        >
          Track Your Order
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 font-sans mb-10"
        >
          Enter your Tracking Token below to see the current status of your shipment.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-midnight/50 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)]"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="e.g. TM-2024-XPQ9" 
              className="flex-1 bg-void border border-white/10 rounded-lg px-4 py-3 text-pearl focus:border-electric focus:ring-1 focus:ring-electric outline-none transition-all font-sans uppercase"
            />
            <button 
              onClick={handleTrack}
              disabled={isLoading}
              className="bg-electric text-white font-sans font-medium uppercase tracking-wider py-3 px-8 rounded-lg hover:bg-blue-600 transition-all hover:shadow-[0_0_20px_rgba(100,181,246,0.4)] disabled:opacity-50"
            >
              {isLoading ? 'Searching...' : 'Track'}
            </button>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-crimson font-sans bg-crimson/10 border border-crimson/30 py-3 px-4 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {result && !error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-left border-t border-white/10 pt-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-electric/20 rounded-full flex items-center justify-center text-electric">
                  <Truck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-display text-pearl">Order Status: <span className="text-gold">{result.status}</span></h3>
                  <p className="text-gray-400 text-sm font-sans">Last Updated: {result.date}</p>
                </div>
              </div>
              <div className="bg-void p-4 rounded-lg border border-white/5">
                <p className="text-sm font-sans text-gray-400 uppercase tracking-widest mb-1">Shipping To</p>
                <p className="text-pearl font-sans">{result.address}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Track;
