import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, UploadCloud, MessageCircle } from 'lucide-react';
import axios from 'axios';
import useCartStore from '../store/useCartStore';

const steps = ['Shipping', 'Payment', 'Review'];

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    name: '', phone: '', address: '', city: '', postalCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [proofImage, setProofImage] = useState(null);

  const { subtotal, discount, total } = getCartTotal();
  const shippingPrice = 250;
  const taxPrice = 0;
  const totalAmount = total + shippingPrice + taxPrice;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    // Basic validation
    if (currentStep === 0 && (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city)) {
      alert('Please fill all required shipping fields');
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const submitOrder = async () => {
    try {
      setLoading(true);
      setError('');
      
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.product,
          size: item.size,
          color: item.color
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice,
        shippingPrice,
        totalPrice: totalAmount,
      };

      const { data } = await axios.post(import.meta.env.VITE_API_URL + '/orders', orderData, {
        withCredentials: true
      });
      
      // Clear cart and redirect
      clearCart();
      navigate('/order-success', { state: { token: data.orderToken, paymentMethod } });
    } catch (err) {
      setError(err.response?.data?.message || 'Error placing order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && currentStep === 0) {
    return (
      <div className="pt-32 min-h-screen bg-void text-center">
        <h2 className="text-2xl font-display text-pearl">Your cart is empty</h2>
        <button onClick={() => navigate('/shop')} className="mt-4 text-electric underline">Return to Shop</button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-void">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-white/10 z-0"></div>
            {steps.map((step, index) => (
              <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-sans text-sm transition-colors ${
                  currentStep > index ? 'bg-electric text-white' : 
                  currentStep === index ? 'bg-void border-2 border-electric text-electric' : 
                  'bg-void border border-white/20 text-gray-500'
                }`}>
                  {currentStep > index ? <CheckCircle2 size={16} /> : index + 1}
                </div>
                <span className={`text-xs font-sans uppercase tracking-wider ${currentStep >= index ? 'text-pearl' : 'text-gray-500'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Form Area */}
          <div className="flex-1">
            {/* Step 1: Shipping */}
            {currentStep === 0 && (
              <div className="bg-midnight border border-white/5 p-8 rounded-lg">
                <h2 className="text-2xl font-display text-pearl mb-6">Shipping Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm text-gray-400 font-sans mb-2">Full Name *</label>
                    <input 
                      type="text" 
                      value={shippingAddress.name}
                      onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                      className="w-full bg-void border border-white/10 rounded px-4 py-3 text-pearl font-sans focus:outline-none focus:border-electric" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 font-sans mb-2">Phone Number *</label>
                    <input 
                      type="tel" 
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                      className="w-full bg-void border border-white/10 rounded px-4 py-3 text-pearl font-sans focus:outline-none focus:border-electric" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 font-sans mb-2">City *</label>
                    <input 
                      type="text" 
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      className="w-full bg-void border border-white/10 rounded px-4 py-3 text-pearl font-sans focus:outline-none focus:border-electric" 
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm text-gray-400 font-sans mb-2">Detailed Address *</label>
                    <textarea 
                      rows="3"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                      className="w-full bg-void border border-white/10 rounded px-4 py-3 text-pearl font-sans focus:outline-none focus:border-electric resize-none" 
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 1 && (
              <div className="bg-midnight border border-white/5 p-8 rounded-lg">
                <h2 className="text-2xl font-display text-pearl mb-6">Payment Method</h2>
                <div className="space-y-4">
                  {['COD', 'EasyPaisa', 'JazzCash', 'BankTransfer'].map((method) => (
                    <label key={method} className={`flex items-start gap-4 p-4 border rounded cursor-pointer transition-colors ${paymentMethod === method ? 'border-electric bg-electric/5' : 'border-white/10 hover:border-white/20'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value={method} 
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 form-radio text-electric bg-void border-gray-600 focus:ring-electric"
                      />
                      <div>
                        <div className="text-pearl font-sans font-medium">{method === 'COD' ? 'Cash on Delivery (COD)' : method === 'BankTransfer' ? 'Direct Bank Transfer' : method}</div>
                        <div className="text-sm text-gray-500 font-sans mt-1">
                          {method === 'COD' ? 'Pay with cash upon delivery.' : `Pay manually via ${method} and share the screenshot in the next step.`}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Review & Proof */}
            {currentStep === 2 && (
              <div className="bg-midnight border border-white/5 p-8 rounded-lg">
                <h2 className="text-2xl font-display text-pearl mb-6">Review & Complete</h2>
                {error && <div className="mb-4 p-4 bg-crimson/20 border border-crimson text-white rounded font-sans text-sm">{error}</div>}
                
                {paymentMethod !== 'COD' && (
                  <div className="mb-8 p-6 bg-void border border-gold/30 rounded-lg">
                    <h3 className="text-gold font-sans font-medium uppercase tracking-wider text-sm mb-4">Manual Payment Instructions</h3>
                    <p className="text-gray-300 text-sm font-sans mb-4">
                      Please send <strong>Rs. {totalAmount.toLocaleString()}</strong> to the following {paymentMethod} account:
                    </p>
                    <div className="font-mono text-pearl bg-midnight p-4 rounded mb-6 border border-white/10 text-lg">
                      {paymentMethod === 'EasyPaisa' && '0345-1234567 (Account Title: ThreadMarket)'}
                      {paymentMethod === 'JazzCash' && '0300-1234567 (Account Title: ThreadMarket)'}
                      {paymentMethod === 'BankTransfer' && 'Meezan Bank\nAccount: 0123456789\nTitle: ThreadMarket PVT LTD'}
                    </div>

                    <p className="text-gray-400 text-sm font-sans mb-4">After sending the payment, please upload the screenshot below or share it on WhatsApp to confirm your order.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-electric transition-colors bg-midnight/50">
                        <UploadCloud className="text-gray-400 mb-2" size={24} />
                        <span className="text-sm text-pearl font-sans">{proofImage ? 'Screenshot Selected' : 'Upload Screenshot'}</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => setProofImage(e.target.files[0])} />
                      </label>
                      <button className="flex-1 flex flex-col items-center justify-center p-6 border border-[#25D366]/30 bg-[#25D366]/10 rounded-lg cursor-pointer hover:bg-[#25D366]/20 transition-colors">
                        <MessageCircle className="text-[#25D366] mb-2" size={24} />
                        <span className="text-sm text-pearl font-sans">Share to WhatsApp</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="border border-white/10 rounded-lg overflow-hidden">
                  <div className="p-4 bg-void border-b border-white/10">
                    <h3 className="font-sans text-pearl">Shipping To</h3>
                    <p className="text-sm text-gray-400 mt-1">{shippingAddress.name}, {shippingAddress.phone}</p>
                    <p className="text-sm text-gray-400">{shippingAddress.address}, {shippingAddress.city}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              {currentStep > 0 ? (
                <button onClick={handleBack} className="text-gray-400 hover:text-pearl font-sans uppercase tracking-widest text-sm transition-colors py-3 px-6">
                  Back
                </button>
              ) : <div></div>}
              
              {currentStep < steps.length - 1 ? (
                <button 
                  onClick={handleNext}
                  className="bg-electric text-white font-sans font-medium uppercase tracking-wider py-3 px-8 rounded flex items-center gap-2 hover:bg-blue-600 transition-all"
                >
                  Continue <ChevronRight size={18} />
                </button>
              ) : (
                <button 
                  onClick={submitOrder}
                  disabled={loading}
                  className="bg-gold text-void font-sans font-medium uppercase tracking-wider py-3 px-8 rounded flex items-center gap-2 hover:bg-yellow-500 transition-all disabled:opacity-70"
                >
                  {loading ? 'Processing...' : (
                    <>Place Order <CheckCircle2 size={18} /></>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-midnight border border-white/10 p-6 rounded-lg sticky top-32">
              <h3 className="font-display text-pearl mb-4 border-b border-white/10 pb-4">Order Summary</h3>
              
              <div className="space-y-4 max-h-60 overflow-y-auto hide-scrollbar mb-4 border-b border-white/10 pb-4">
                {cartItems.map(item => (
                  <div key={`${item.product}-${item.size}`} className="flex gap-3">
                    <div className="w-16 h-20 bg-void rounded overflow-hidden flex-shrink-0 border border-white/5">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-pearl text-sm font-sans line-clamp-1">{item.name}</div>
                      <div className="text-gray-500 text-xs mt-1 font-sans">Qty: {item.qty}</div>
                      <div className="text-electric text-xs font-mono mt-1">Rs. {(item.price * item.qty).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 font-sans text-sm mb-4 border-b border-white/10 pb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-pearl font-mono">Rs. {subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-electric">
                    <span>Discount</span>
                    <span className="font-mono">- Rs. {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-pearl font-mono">Rs. {shippingPrice}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end">
                <span className="text-pearl font-sans">Total</span>
                <span className="text-xl font-mono text-electric font-medium">Rs. {totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
