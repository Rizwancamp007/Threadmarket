import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, MapPin } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const token = location.state?.token || 'TM-UNKNOWN';
  const paymentMethod = location.state?.paymentMethod || 'COD';

  return (
    <div className="min-h-screen bg-void pt-32 pb-20 flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-midnight border border-white/10 rounded-2xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-electric/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-crimson/10 rounded-full blur-3xl"></div>

          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500"
          >
            <CheckCircle2 size={40} />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-display text-pearl mb-4">Order Confirmed!</h1>
          
          {paymentMethod === 'COD' ? (
            <p className="text-gray-400 font-sans mb-8">
              Thank you for your purchase. We've received your order and it is currently being processed. You will pay in cash upon delivery.
            </p>
          ) : (
            <p className="text-gray-400 font-sans mb-8">
              Thank you! Your order has been placed. Our team will verify your payment screenshot/WhatsApp message and process the order shortly.
            </p>
          )}

          <div className="bg-void border border-white/5 rounded-xl p-6 mb-8 text-left">
            <p className="text-sm text-gray-500 font-sans uppercase tracking-widest mb-2">Tracking Token</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono text-electric tracking-wider">{token}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(token)}
                className="text-xs text-gold hover:text-white uppercase tracking-wider font-sans border border-gold/30 px-3 py-1 rounded-full transition-colors"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 font-sans">Please save this token. You can use it to track your order status on our website.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/track?token=${token}`} className="bg-electric text-white font-sans font-medium uppercase tracking-wider py-4 px-8 rounded hover:bg-blue-600 transition-all">
              Track Order
            </Link>
            <Link to="/shop" className="border border-white/20 text-pearl font-sans font-medium uppercase tracking-wider py-4 px-8 rounded hover:bg-white/5 transition-all">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;
