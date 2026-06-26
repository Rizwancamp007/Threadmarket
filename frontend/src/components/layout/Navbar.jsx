import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, LayoutDashboard } from 'lucide-react';
import useCartStore from '../../store/useCartStore';
import useAuthStore from '../../store/useAuthStore';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { toggleDrawer, getCartCount, cartItems } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-void/90 backdrop-blur-md border-b border-border py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-display font-bold tracking-wider text-pearl">
            THREAD<span className="text-gold">MARKET</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-xs font-sans tracking-[0.2em] text-pearl hover:text-gold transition-colors uppercase relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/shop" className="text-xs font-sans tracking-[0.2em] text-pearl hover:text-gold transition-colors uppercase relative group">
              Collection
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/about" className="text-xs font-sans tracking-[0.2em] text-pearl hover:text-gold transition-colors uppercase relative group">
              Story
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/track" className="text-xs font-sans tracking-[0.2em] text-pearl hover:text-gold transition-colors uppercase relative group">
              Track
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="text-xs font-sans tracking-[0.2em] text-pearl hover:text-gold transition-colors uppercase relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-pearl hover:text-gold transition-colors" title="Admin Dashboard">
                <LayoutDashboard size={20} />
              </Link>
            )}
            <Link to={user ? "/account" : "/admin/login"} className="text-pearl hover:text-gold transition-colors" title="Account">
              <User size={20} />
            </Link>
            <button onClick={toggleDrawer} className="text-pearl hover:text-gold transition-colors relative">
              <ShoppingBag size={20} />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-crimson text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
            <button className="md:hidden text-pearl" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-void border-b border-border transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-64' : 'max-h-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
          <Link to="/" className="text-pearl hover:text-gold font-sans uppercase tracking-widest py-2 border-b border-white/5">Home</Link>
          <Link to="/shop" className="text-pearl hover:text-gold font-sans uppercase tracking-widest py-2 border-b border-white/5">Collection</Link>
          <Link to="/about" className="text-pearl hover:text-gold font-sans uppercase tracking-widest py-2 border-b border-white/5">Story</Link>
          <Link to="/track" className="text-pearl hover:text-gold font-sans uppercase tracking-widest py-2 border-b border-white/5">Track</Link>
          <Link to="/contact" className="text-pearl hover:text-gold font-sans uppercase tracking-widest py-2 border-b border-white/5">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
