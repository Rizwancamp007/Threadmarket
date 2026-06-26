import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig';

const Footer = () => {
  return (
    <footer className="bg-void border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-display font-bold tracking-wider text-pearl block mb-4">
              THREAD<span className="text-gold">MARKET</span>
            </Link>
            <p className="text-sm text-gray-400 font-sans max-w-md leading-relaxed mb-6">
              Elevating local Pakistani fashion brands to global standards. A premium SaaS marketplace for designers, boutiques, and fashion enthusiasts.
            </p>
            <div className="flex space-x-4">
              {siteConfig.instagram && (
                <a href={siteConfig.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-all duration-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              )}
              {siteConfig.facebook && (
                <a href={siteConfig.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-all duration-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
              )}
              {siteConfig.whatsappNumber && (
                <a href={`https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-all duration-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </a>
              )}
              {siteConfig.youtube && (
                <a href={siteConfig.youtube} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-all duration-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-pearl font-display mb-4 text-lg">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/shop?category=pret" className="text-gray-400 hover:text-electric text-sm transition-colors">Pret Wear</Link></li>
              <li><Link to="/shop?category=unstitched" className="text-gray-400 hover:text-electric text-sm transition-colors">Unstitched</Link></li>
              <li><Link to="/shop?category=formal" className="text-gray-400 hover:text-electric text-sm transition-colors">Formals</Link></li>
              <li><Link to="/shop?category=mens" className="text-gray-400 hover:text-electric text-sm transition-colors">Menswear</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-pearl font-display mb-4 text-lg">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/track" className="text-gray-400 hover:text-electric text-sm transition-colors">Track Order</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-electric text-sm transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-electric text-sm transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-electric text-sm transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs font-mono">
            &copy; {new Date().getFullYear()} ThreadMarket SaaS. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-gray-500 text-xs font-mono">
            <Link to="/privacy" className="hover:text-pearl">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-pearl">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
