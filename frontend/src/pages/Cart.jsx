import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, X, ArrowRight, Tag, CheckCircle } from 'lucide-react';
import axios from 'axios';
import useCartStore from '../store/useCartStore';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, getCartTotal, promoCode, applyPromo, removePromo } = useCartStore();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [loadingPromo, setLoadingPromo] = useState(false);

  const { subtotal, discount, total } = getCartTotal();

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setLoadingPromo(true);
    setPromoError('');
    try {
      const { data } = await axios.post('http://localhost:5000/api/promo/validate', {
        code: promoInput,
        cartTotal: subtotal
      });
      applyPromo(data);
      setPromoInput('');
    } catch (error) {
      setPromoError(error.response?.data?.message || 'Invalid promo code');
    } finally {
      setLoadingPromo(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display text-pearl mb-10 border-b border-white/10 pb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-sans text-gray-400 mb-6">Your cart is empty</h2>
            <Link to="/shop" className="bg-electric text-white font-sans font-medium uppercase tracking-wider py-4 px-8 rounded-full hover:bg-blue-600 transition-all">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-sans uppercase tracking-widest text-gray-500 border-b border-white/10 pb-4 mb-6">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={`${item.product}-${item.size}-${item.color}`} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-white/5 pb-6">
                    <div className="col-span-1 md:col-span-6 flex gap-4">
                      <div className="w-24 h-32 bg-midnight rounded border border-white/5 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <Link to={`/product/${item.slug || item.product}`} className="text-pearl font-display text-lg hover:text-gold transition-colors">
                          {item.name}
                        </Link>
                        <p className="text-gray-500 text-sm font-sans mt-1">
                          {item.color} | Size: {item.size}
                        </p>
                        <button 
                          onClick={() => removeFromCart(item.product, item.size, item.color)}
                          className="text-gray-500 hover:text-crimson text-sm mt-3 flex items-center gap-1 w-fit"
                        >
                          <X size={14} /> Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 md:text-center font-mono text-pearl">
                      <span className="md:hidden text-gray-500 text-sm mr-2 font-sans">Price:</span>
                      Rs. {item.price.toLocaleString()}
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center">
                      <span className="md:hidden text-gray-500 text-sm mr-2 font-sans flex items-center">Qty:</span>
                      <div className="flex items-center border border-white/20 rounded h-10 w-24">
                        <button 
                          onClick={() => updateQty(item.product, item.size, item.color, Math.max(1, item.qty - 1))}
                          className="flex-1 flex justify-center text-gray-400 hover:text-pearl"
                        ><Minus size={14} /></button>
                        <span className="font-mono text-pearl text-sm">{item.qty}</span>
                        <button 
                          onClick={() => updateQty(item.product, item.size, item.color, item.qty + 1)}
                          className="flex-1 flex justify-center text-gray-400 hover:text-pearl"
                        ><Plus size={14} /></button>
                      </div>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 text-right font-mono text-electric font-medium text-lg">
                      <span className="md:hidden text-gray-500 text-sm mr-2 font-sans">Total:</span>
                      Rs. {(item.price * item.qty).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary & Promo Code */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="bg-midnight border border-white/10 p-8 rounded-lg sticky top-32">
                
                {/* Promo Code Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-display text-pearl mb-4 flex items-center gap-2">
                    <Tag size={18} className="text-gold" /> Promo Code
                  </h3>
                  
                  {promoCode ? (
                    <div className="bg-electric/10 border border-electric/30 p-3 rounded flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-electric" />
                        <span className="text-pearl font-mono text-sm">{promoCode.code}</span>
                      </div>
                      <button onClick={removePromo} className="text-gray-400 hover:text-crimson text-sm font-sans transition-colors">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="Enter code" 
                          className="w-full bg-void border border-white/10 text-pearl font-mono px-4 py-3 focus:outline-none focus:border-electric transition-colors"
                        />
                        <button 
                          onClick={handleApplyPromo}
                          disabled={loadingPromo || !promoInput.trim()}
                          className="bg-white/10 hover:bg-white/20 text-pearl px-6 font-sans font-medium uppercase tracking-wider transition-colors disabled:opacity-50"
                        >
                          {loadingPromo ? '...' : 'Apply'}
                        </button>
                      </div>
                      {promoError && <p className="text-crimson text-xs mt-2 font-sans">{promoError}</p>}
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-display text-pearl mb-6 border-t border-white/10 pt-6">Order Summary</h3>
                
                <div className="space-y-4 font-sans text-sm mb-6 border-b border-white/10 pb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-pearl font-mono">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-electric">
                      <span>Discount ({promoCode?.code})</span>
                      <span className="font-mono">- Rs. {discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-pearl">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax</span>
                    <span className="text-pearl">Included</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-end mb-8">
                  <span className="text-pearl font-sans text-lg">Total</span>
                  <span className="text-2xl font-mono text-electric">Rs. {total.toLocaleString()}</span>
                </div>
                
                <Link 
                  to="/checkout"
                  className="w-full bg-electric text-white font-sans font-medium uppercase tracking-wider py-4 rounded flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-[0_0_15px_rgba(100,181,246,0.2)]"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
