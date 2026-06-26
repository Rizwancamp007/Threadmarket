import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ui/ProductCard';
import SEO from '../components/SEO';

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('Newest Arrivals');
  const [priceFilters, setPriceFilters] = useState({
    under5k: false,
    fiveTo15k: false,
    above15k: false
  });

  const observer = useRef();
  const lastProductElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Fetch Categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(import.meta.env.VITE_API_URL + '/categories');
        setCategories([{ name: 'All', slug: 'all' }, ...data]);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products when filters or page change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = `${import.meta.env.VITE_API_URL}/products?limit=6&page=${page}`;
        
        if (activeCategory !== 'All') {
          const categorySlug = categories.find(c => c.name === activeCategory)?.slug;
          if (categorySlug) {
            url += `&category=${categorySlug}`;
          }
        }

        if (sortOption === 'Price: Low to High') url += '&sort=price_asc';
        if (sortOption === 'Price: High to Low') url += '&sort=price_desc';

        if (priceFilters.under5k) url += '&maxPrice=5000';
        else if (priceFilters.fiveTo15k) url += '&minPrice=5000&maxPrice=15000';
        else if (priceFilters.above15k) url += '&minPrice=15000';

        const { data } = await axios.get(url);
        
        setProducts(prev => {
          if (page === 1) return data.products;
          return [...prev, ...data.products];
        });
        setHasMore(data.hasMore);
        setTotalProducts(data.total);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, activeCategory, sortOption, priceFilters]); // Removed categories from deps to prevent double fetch on initial load

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [activeCategory, sortOption, priceFilters]);

  const handlePriceChange = (e) => {
    const { name } = e.target;
    // For simplicity, make price filters mutually exclusive in UI
    setPriceFilters({
      under5k: name === 'under5k' ? e.target.checked : false,
      fiveTo15k: name === 'fiveTo15k' ? e.target.checked : false,
      above15k: name === 'above15k' ? e.target.checked : false
    });
  };

  return (
    <div className="pt-24 pb-20 bg-transparent min-h-screen">
      <SEO title="Shop Collections | ThreadMarket" />
      {/* Page Header */}
      <div className="bg-midnight py-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display text-pearl mb-4"
          >
            The Collection
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 font-sans max-w-2xl mx-auto"
          >
            Explore our curated selection of premium fashion. Filter by style, material, and designer to find your perfect fit.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="md:hidden flex justify-between items-center bg-midnight p-4 rounded-lg border border-white/5">
            <span className="text-pearl font-sans">Filters</span>
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="text-electric">
              <SlidersHorizontal size={20} />
            </button>
          </div>

          {/* Sidebar / Filters */}
          <motion.aside 
            className={`${isFilterOpen ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0 space-y-8`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Categories */}
            <div>
              <h3 className="text-pearl font-display text-lg mb-4 flex justify-between items-center border-b border-white/10 pb-2">
                Categories
              </h3>
              <ul className="space-y-3">
                {categories.length > 0 ? categories.map(cat => (
                  <li key={cat.slug || cat.name}>
                    <button 
                      onClick={() => setActiveCategory(cat.name)}
                      className={`text-sm font-sans transition-colors ${activeCategory === cat.name ? 'text-electric font-medium' : 'text-gray-400 hover:text-pearl'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                )) : (
                  <div className="animate-pulse flex flex-col space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                  </div>
                )}
              </ul>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-pearl font-display text-lg mb-4 flex justify-between items-center border-b border-white/10 pb-2">
                Price Range <ChevronDown size={16} className="text-gray-500" />
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 text-sm text-gray-400 font-sans cursor-pointer">
                  <input type="checkbox" name="under5k" checked={priceFilters.under5k} onChange={handlePriceChange} className="form-checkbox h-4 w-4 text-electric rounded border-gray-600 bg-midnight focus:ring-electric focus:ring-offset-void" />
                  <span>Under Rs. 5,000</span>
                </label>
                <label className="flex items-center space-x-3 text-sm text-gray-400 font-sans cursor-pointer">
                  <input type="checkbox" name="fiveTo15k" checked={priceFilters.fiveTo15k} onChange={handlePriceChange} className="form-checkbox h-4 w-4 text-electric rounded border-gray-600 bg-midnight focus:ring-electric focus:ring-offset-void" />
                  <span>Rs. 5,000 - Rs. 15,000</span>
                </label>
                <label className="flex items-center space-x-3 text-sm text-gray-400 font-sans cursor-pointer">
                  <input type="checkbox" name="above15k" checked={priceFilters.above15k} onChange={handlePriceChange} className="form-checkbox h-4 w-4 text-electric rounded border-gray-600 bg-midnight focus:ring-electric focus:ring-offset-void" />
                  <span>Above Rs. 15,000</span>
                </label>
              </div>
            </div>
          </motion.aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Top Toolbar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-400 text-sm font-sans">
                Showing <span className="text-pearl font-medium">{products.length}</span> of <span className="text-pearl font-medium">{totalProducts}</span> results
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm font-sans hidden sm:inline">Sort by:</span>
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-midnight border border-white/10 text-pearl text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-electric font-sans"
                >
                  <option>Newest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length > 0 ? (
                <AnimatePresence>
                  {products.map((product, index) => {
                    const isLast = products.length === index + 1;
                    return (
                      <motion.div
                        ref={isLast ? lastProductElementRef : null}
                        key={product._id + index} // Append index just in case of duplicates during fast scrolling
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              ) : !loading && (
                <div className="col-span-full text-center py-20 text-gray-500 font-sans">
                  No products found matching your filters.
                </div>
              )}
            </div>

            {/* Infinite Scroll Loader */}
            {loading && (
              <div className="mt-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
              </div>
            )}
            
            {!hasMore && products.length > 0 && (
              <div className="mt-12 text-center text-gray-500 text-sm font-sans">
                You've reached the end of the collection.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Shop;
