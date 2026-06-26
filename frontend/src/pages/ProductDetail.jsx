import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Heart, Share2, Plus, Minus, Truck, ShieldCheck, ArrowDownCircle } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import useCartStore from '../store/useCartStore';
import SEO from '../components/SEO';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/products/slug/${slug}`);
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-transparent">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center bg-transparent text-center px-4">
        <h2 className="text-4xl font-display text-pearl mb-4">Oops!</h2>
        <p className="text-gray-400 font-sans mb-8">{error || 'Product not found'}</p>
        <Link to="/shop" className="bg-electric text-white font-sans font-medium uppercase tracking-wider py-4 px-8 rounded-full">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-transparent min-h-screen">
      <SEO 
        title={`${product.name} | ThreadMarket`}
        description={product.description.replace(/<[^>]+>/g, '').substring(0, 160)}
        image={product.images && product.images[0]}
      />
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center space-x-2 text-sm font-sans text-gray-500">
          <Link to="/" className="hover:text-pearl transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" className="hover:text-pearl transition-colors">Shop</Link>
          <ChevronRight size={14} />
          <span className="hover:text-pearl cursor-pointer transition-colors">{product.category?.name}</span>
          <ChevronRight size={14} />
          <span className="text-electric">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Image Gallery */}
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col-reverse md:flex-row gap-4">
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto hide-scrollbar md:w-24 flex-shrink-0">
                  {product.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative aspect-[3/4] w-20 md:w-full overflow-hidden border transition-all ${activeImage === idx ? 'border-electric' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`${product.name} ${idx}`} loading="lazy" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              
              {/* Main Image */}
              <div className="flex-1 relative aspect-[3/4] bg-midnight overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={product.images ? product.images[activeImage] : ''} 
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* Custom Label */}
                {product.isFeatured && (
                  <div className="absolute top-4 left-4 bg-crimson text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full">
                    Featured
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-sm text-gold font-sans tracking-widest uppercase mb-2">
                {product.category?.name}
              </div>
              <h1 className="text-4xl md:text-5xl font-display text-pearl mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-2xl font-mono text-electric">
                  Rs. {product.price.toLocaleString()}
                </div>
                {product.discountedPrice && (
                  <div className="text-lg font-mono text-gray-500 line-through">
                    Rs. {product.discountedPrice.toLocaleString()}
                  </div>
                )}
              </div>
              
              <div 
                className="text-gray-400 font-sans leading-relaxed mb-8 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              ></div>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-pearl font-sans">Color: <span className="text-gray-400">{selectedColor}</span></span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map(color => (
                      <button 
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`py-2 px-4 border text-sm font-sans transition-all ${selectedColor === color ? 'border-electric text-electric bg-electric/10' : 'border-white/20 text-gray-400 hover:border-white/50'}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-pearl font-sans">Size: <span className="text-gray-400">{selectedSize}</span></span>
                    <button className="text-xs text-electric underline underline-offset-4 font-sans hover:text-white transition-colors">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map(size => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 flex items-center justify-center border text-sm font-sans transition-all ${selectedSize === size ? 'border-gold text-gold bg-gold/10' : 'border-white/20 text-gray-400 hover:border-white/50'} ${size === 'Custom' || size === 'Unstitched' || size === 'Free Size' ? 'w-auto px-4' : ''}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                {/* Quantity */}
                <div className="flex items-center border border-white/20 h-14 w-full sm:w-32">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex-1 flex justify-center text-gray-400 hover:text-pearl"><Minus size={18} /></button>
                  <span className="text-pearl font-mono">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="flex-1 flex justify-center text-gray-400 hover:text-pearl"><Plus size={18} /></button>
                </div>
                
                {/* Add to Cart */}
                <button 
                  onClick={() => addToCart(product, qty, selectedSize, selectedColor)}
                  disabled={product.stock === 0}
                  className={`flex-1 font-sans font-medium uppercase tracking-wider h-14 flex items-center justify-center transition-all ${product.stock > 0 ? 'bg-electric hover:bg-blue-600 text-white hover:shadow-[0_0_20px_rgba(100,181,246,0.3)]' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                
                {/* Icons */}
                <div className="flex gap-2">
                  <button className="w-14 h-14 border border-white/20 flex items-center justify-center text-gray-400 hover:text-crimson hover:border-crimson transition-colors">
                    <Heart size={20} />
                  </button>
                  <button className="w-14 h-14 border border-white/20 flex items-center justify-center text-gray-400 hover:text-pearl hover:border-pearl transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-y border-white/10 mb-8">
                <div className="flex items-center gap-3 text-gray-400">
                  <Truck size={20} className="text-electric" />
                  <span className="text-sm font-sans">Nationwide Delivery</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <ShieldCheck size={20} className="text-gold" />
                  <span className="text-sm font-sans">100% Authentic Quality</span>
                </div>
              </div>

              {/* Tabs / Accordions */}
              <div>
                <div className="flex border-b border-white/10 mb-4">
                  <button 
                    onClick={() => setActiveTab('details')}
                    className={`pb-3 mr-8 text-sm font-sans uppercase tracking-widest transition-colors relative ${activeTab === 'details' ? 'text-pearl' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Details
                    {activeTab === 'details' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric" />}
                  </button>
                  <button 
                    onClick={() => setActiveTab('shipping')}
                    className={`pb-3 mr-8 text-sm font-sans uppercase tracking-widest transition-colors relative ${activeTab === 'shipping' ? 'text-pearl' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Shipping
                    {activeTab === 'shipping' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric" />}
                  </button>
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-gray-400 font-sans leading-relaxed"
                  >
                    {activeTab === 'details' ? (
                      <ul className="space-y-2 list-disc pl-4 marker:text-gold">
                        {product.fabric && <li><strong>Fabric:</strong> {product.fabric}</li>}
                        {product.tags && product.tags.length > 0 && <li><strong>Tags:</strong> {product.tags.join(', ')}</li>}
                        <li>100% Original Product</li>
                        <li>High Quality Finish</li>
                      </ul>
                    ) : (
                      <p>Standard delivery within 3-5 business days. For customized sizes (if applicable), please allow an additional 10-15 business days for tailoring.</p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
