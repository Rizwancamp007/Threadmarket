import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, EyeOff, Search } from 'lucide-react';
import axios from 'axios';
import ProductFormModal from '../../components/admin/ProductFormModal';

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(import.meta.env.VITE_API_URL + '/products/admin', { withCredentials: true });
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, { withCredentials: true });
        fetchProducts(); // Refresh list
      } catch (error) {
        console.error('Error deleting product', error);
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  // Simple client-side search filter
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display text-pearl mb-2">Products</h1>
          <p className="text-gray-400 font-sans text-sm">Manage your inventory, pricing, and visibility.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-electric text-white font-sans font-medium uppercase tracking-wider py-3 px-6 rounded flex items-center gap-2 hover:bg-blue-600 transition-all shadow-[0_0_15px_rgba(100,181,246,0.2)]"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="bg-midnight border border-white/5 rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-void border border-white/10 rounded-lg pl-10 pr-4 py-2 text-pearl font-sans focus:outline-none focus:border-electric text-sm"
            />
          </div>
          <select className="bg-void border border-white/10 rounded-lg px-4 py-2 text-pearl font-sans focus:outline-none focus:border-electric text-sm">
            <option>All Categories</option>
            <option>Formals</option>
            <option>Bridal</option>
            <option>Pret Wear</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-white/5 text-gray-400 uppercase tracking-widest text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((product) => (
                <motion.tr 
                  key={product._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-pearl font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-gray-400">{product.category?.name || 'Uncategorized'}</td>
                  <td className="px-6 py-4 text-electric font-mono">Rs. {product.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`font-mono ${product.stock === 0 ? 'text-crimson' : product.stock < 5 ? 'text-yellow-500' : 'text-gray-400'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs uppercase tracking-wider ${
                      product.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                      'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {product.isActive ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="text-gray-500 hover:text-electric transition-colors" 
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="text-gray-500 hover:text-crimson transition-colors" 
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/5 flex justify-between items-center text-sm font-sans text-gray-500">
          <span>Showing {filteredProducts.length} entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-white/10 rounded hover:bg-white/5 transition-colors">Prev</button>
            <button className="px-3 py-1 bg-electric/20 text-electric border border-electric/30 rounded">1</button>
            <button className="px-3 py-1 border border-white/10 rounded hover:bg-white/5 transition-colors">Next</button>
          </div>
        </div>
      </div>

      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSuccess={fetchProducts}
      />
    </div>
  );
};

export default ProductList;
