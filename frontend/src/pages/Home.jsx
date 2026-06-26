import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ui/ProductCard';
import SEO from '../components/SEO';
import { siteConfig } from '../config/siteConfig';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [stats, setStats] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Fetch featured products, stats, and banners concurrently
        const [prodRes, statsRes, bannerRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products?featured=true&limit=8'),
          axios.get('http://localhost:5000/api/stats/public'),
          axios.get('http://localhost:5000/api/banners')
        ]);

        setFeaturedProducts(prodRes.data.products);
        setStats(statsRes.data);
        setBanners(bannerRes.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="w-full">
      <SEO />
      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-void/60 z-10"></div> {/* Overlay */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            poster="/images/hero.jpg"
            className="w-full h-full object-cover"
          >
            {/* Real video asset from local assets */}
            <source src="/assets/demo-video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-gold font-sans tracking-[0.3em] uppercase text-sm mb-4 block">
              The New Standard
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-pearl mb-6 leading-tight">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-crimson via-gold to-electric">
                Wardrobe
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-gray-300 font-sans max-w-xl mx-auto mb-10 text-lg">
              Discover premium Pakistani fashion from the country's top independent designers and boutiques.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/shop" className="bg-electric text-white font-sans font-medium uppercase tracking-wider py-4 px-8 rounded-full hover:bg-blue-600 transition-all hover:shadow-[0_0_20px_rgba(100,181,246,0.4)]">
              Explore Collection
            </Link>
            <Link to="/about" className="bg-transparent border border-white/20 text-pearl font-sans font-medium uppercase tracking-wider py-4 px-8 rounded-full hover:bg-white/10 transition-all">
              Our Story
            </Link>
          </motion.div>
        </div>

        
      </section>

      {/* Dynamic Banners Section */}
      {banners && banners.length > 0 && (
        <section className="bg-void py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((banner) => (
                <a 
                  key={banner._id} 
                  href={banner.link || '#'} 
                  className="relative group overflow-hidden rounded-2xl block h-64 md:h-80"
                >
                  <img 
                    src={banner.image} 
                    alt={banner.title} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/20 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-2xl font-display text-pearl mb-2">{banner.title}</h3>
                    <p className="text-gray-300 font-sans text-sm">{banner.subtitle}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section (Moved above Latest Arrivals) */}
      <section className="py-20 bg-midnight/50 backdrop-blur-md relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.length > 0 ? (
              stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="text-4xl md:text-5xl font-display text-gold mb-2">{stat.value}</div>
                  <div className="text-xs md:text-sm text-gray-400 font-sans tracking-widest uppercase">{stat.label}</div>
                </motion.div>
              ))
            ) : (
              [
                { label: 'Happy Clients', value: '10K+' },
                { label: 'Premium Brands', value: '50+' },
                { label: 'Cities Delivered', value: '120' },
                { label: 'Positive Reviews', value: '4.9/5' }
              ].map((stat, i) => (
                <motion.div key={i} className="opacity-50">
                  <div className="text-4xl md:text-5xl font-display text-gold mb-2">{stat.value}</div>
                  <div className="text-xs md:text-sm text-gray-400 font-sans tracking-widest uppercase">{stat.label}</div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Collection Grid */}
      <section className="py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-display text-pearl mb-4">Latest Arrivals</h2>
              <p className="text-gray-400 font-sans">Curated specifically for the modern aesthetic.</p>
            </div>
            <Link to="/shop" className="hidden md:inline-block text-gold hover:text-white uppercase tracking-widest font-sans text-sm pb-1 border-b border-gold hover:border-white transition-colors">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/shop" className="inline-block border border-white/20 text-pearl uppercase tracking-widest font-sans text-sm py-3 px-8 rounded-full">
              View All Products
            </Link>
          </div>
        </div>
      </section>

        </div>
      
  );
};

export default Home;
