import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';

const CartDrawer = () => {
  const { isDrawerOpen, setDrawerOpen, cartItems, removeFromCart, updateQty, getCartTotal } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-void/80 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-midnight border-l border-white/10 z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-display text-pearl flex items-center gap-2">
                <ShoppingBag size={20} className="text-electric" />
                Your Cart
              </h2>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <ShoppingBag size={48} className="mb-4 opacity-20" />
                  <p className="font-sans">Your cart is empty.</p>
                  <button 
                    onClick={() => { setDrawerOpen(false); navigate('/shop'); }}
                    className="mt-6 text-electric underline underline-offset-4"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={`${item.product}-${item.size}-${item.color}`} className="flex gap-4">
                      <div className="w-20 h-24 bg-void rounded-md overflow-hidden flex-shrink-0 border border-white/5">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-pearl font-display text-sm line-clamp-1">{item.name}</h3>
                            <p className="text-gray-500 text-xs mt-1 font-sans">
                              {item.color} | Size: {item.size}
                            </p>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.product, item.size, item.color)}
                            className="text-gray-500 hover:text-crimson"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        
                        <div className="mt-auto flex justify-between items-center">
                          <div className="flex items-center border border-white/20 rounded">
                            <button 
                              onClick={() => updateQty(item.product, item.size, item.color, Math.max(1, item.qty - 1))}
                              className="px-2 py-1 text-gray-400 hover:text-pearl"
                            ><Minus size={12} /></button>
                            <span className="px-2 text-xs font-mono text-pearl">{item.qty}</span>
                            <button 
                              onClick={() => updateQty(item.product, item.size, item.color, item.qty + 1)}
                              className="px-2 py-1 text-gray-400 hover:text-pearl"
                            ><Plus size={12} /></button>
                          </div>
                          <div className="font-mono text-electric text-sm">
                            Rs. {(item.price * item.qty).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-midnight">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400 font-sans">Subtotal</span>
                  <span className="text-xl font-mono text-pearl">Rs. {getCartTotal().toLocaleString()}</span>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-electric text-white font-sans font-medium uppercase tracking-wider py-4 rounded hover:bg-blue-600 transition-all shadow-[0_0_15px_rgba(100,181,246,0.2)]"
                  >
                    Checkout Securely
                  </button>
                  <button 
                    onClick={() => { setDrawerOpen(false); navigate('/cart'); }}
                    className="w-full border border-white/20 text-pearl font-sans font-medium uppercase tracking-wider py-4 rounded hover:bg-white/5 transition-all"
                  >
                    View Cart Page
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
