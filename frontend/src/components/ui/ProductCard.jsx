import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Increased tilt factor for more dramatic 3D effect
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    // Calculate glare position
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.setProperty('--glare-x', `${glareX}%`);
    card.style.setProperty('--glare-y', `${glareY}%`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    setIsHovered(false);
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div className="relative perspective-1000">
      <Link to={`/product/${product.slug || product._id}`}>
        <div 
          ref={cardRef}
          className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden transition-all duration-300 ease-out hover:border-gold/50 hover:shadow-[0_20px_50px_rgba(198,168,75,0.2)] before:absolute before:inset-0 before:z-20 before:bg-[radial-gradient(circle_at_var(--glare-x,50%)_var(--glare-y,50%),rgba(255,255,255,0.1)_0%,transparent_50%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-midnight">
            <img 
              src={product.images ? product.images[0] : product.image} 
              alt={product.name} 
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />{/* Quick View Overlay */}
            <div className={`absolute inset-0 bg-void/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <span className="bg-electric text-white text-xs font-sans font-medium uppercase tracking-wider py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                Quick View
              </span>
            </div>
            
            {/* Badges */}
            {product.isNew && (
              <div className="absolute top-3 left-3 bg-crimson text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                New
              </div>
            )}
            {product.discount > 0 && (
              <div className="absolute top-3 right-3 bg-gold text-void text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                -{product.discount}%
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5" style={{ transform: 'translateZ(30px)' }}>
            <div className="text-xs text-gray-400 font-sans tracking-widest uppercase mb-2">
              {product.category?.name || product.category}
            </div>
            <h3 className="text-pearl font-display text-lg mb-2 line-clamp-1 group-hover:text-gold transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <div className="font-mono text-electric">
                Rs. {product.price.toLocaleString()}
              </div>
              {product.oldPrice && (
                <div className="font-mono text-gray-500 line-through text-sm">
                  Rs. {product.oldPrice.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
