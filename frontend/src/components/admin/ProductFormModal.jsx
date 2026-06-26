import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, XCircle } from 'lucide-react';
import axios from 'axios';

const ProductFormModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    fabric: '',
    colors: '',
    sizes: '',
    tags: '',
    isFeatured: false,
    isActive: true,
  });
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/categories');
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        category: product.category?._id || product.category || '',
        stock: product.stock || '',
        fabric: product.fabric || '',
        colors: product.colors?.join(', ') || '',
        sizes: product.sizes?.join(', ') || '',
        tags: product.tags?.join(', ') || '',
        isFeatured: product.isFeatured || false,
        isActive: product.isActive !== undefined ? product.isActive : true,
      });
      setImage(product.images?.[0] || '');
    } else {
      setFormData({
        name: '',
        price: '',
        description: '',
        category: '',
        stock: '',
        fabric: '',
        colors: '',
        sizes: '',
        tags: '',
        isFeatured: false,
        isActive: true,
      });
      setImage('');
    }
  }, [product, isOpen]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      setImage(data.imageUrl);
      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
      setError('Image upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Format arrays
    const formattedData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      images: image ? [image] : [],
      colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      if (product) {
        await axios.put(`http://localhost:5000/api/products/${product._id}`, formattedData, {
          withCredentials: true,
        });
      } else {
        await axios.post('http://localhost:5000/api/products', formattedData, {
          withCredentials: true,
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-midnight border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl z-10"
      >
        <div className="sticky top-0 bg-midnight/90 backdrop-blur border-b border-white/10 p-6 flex justify-between items-center z-20">
          <h2 className="text-2xl font-display text-pearl">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && <div className="mb-6 p-4 bg-crimson/10 border border-crimson text-crimson rounded-lg">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Image & Basic Info */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-sans text-gray-400 mb-2">Product Image</label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center">
                  {image ? (
                    <div className="relative inline-block">
                      <img src={image} alt="Preview" className="h-48 rounded object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setImage('')} 
                        className="absolute -top-2 -right-2 bg-void text-white rounded-full p-1"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <Upload className="mx-auto text-gray-500 mb-4" size={32} />
                      <p className="text-gray-400 font-sans text-sm mb-4">Upload a high-res image</p>
                      <input 
                        type="file" 
                        id="image-upload" 
                        className="hidden" 
                        onChange={uploadFileHandler}
                        accept="image/*"
                      />
                      <label 
                        htmlFor="image-upload" 
                        className="bg-white/5 border border-white/10 px-4 py-2 rounded text-pearl text-sm cursor-pointer hover:bg-white/10 transition-colors"
                      >
                        {uploading ? 'Uploading...' : 'Choose File'}
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-sans text-gray-400 mb-2">Product Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-pearl focus:outline-none focus:border-electric transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-sans text-gray-400 mb-2">Price (Rs.) *</label>
                  <input 
                    type="number" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-pearl focus:outline-none focus:border-electric transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-sans text-gray-400 mb-2">Stock Level *</label>
                  <input 
                    type="number" 
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-pearl focus:outline-none focus:border-electric transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-sans text-gray-400 mb-2">Category *</label>
                <select 
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-pearl focus:outline-none focus:border-electric transition-colors"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column: Details & Flags */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-sans text-gray-400 mb-2">Description</label>
                <textarea 
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-pearl focus:outline-none focus:border-electric transition-colors resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-sans text-gray-400 mb-2">Fabric</label>
                <input 
                  type="text" 
                  value={formData.fabric}
                  onChange={(e) => setFormData({...formData, fabric: e.target.value})}
                  className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-pearl focus:outline-none focus:border-electric transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-sans text-gray-400 mb-2">Sizes (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="S, M, L, XL"
                  value={formData.sizes}
                  onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                  className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-pearl focus:outline-none focus:border-electric transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-sans text-gray-400 mb-2">Colors (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="Red, Blue, Green"
                  value={formData.colors}
                  onChange={(e) => setFormData({...formData, colors: e.target.value})}
                  className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-pearl focus:outline-none focus:border-electric transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-sans text-gray-400 mb-2">Tags (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="winter, casual, new"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-pearl focus:outline-none focus:border-electric transition-colors"
                />
              </div>

              <div className="flex gap-8 border border-white/10 rounded-lg p-4 bg-void/50">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-5 h-5 accent-electric rounded"
                  />
                  <span className="text-pearl font-sans text-sm">Active (Public)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                    className="w-5 h-5 accent-gold rounded"
                  />
                  <span className="text-pearl font-sans text-sm">Featured on Home</span>
                </label>
              </div>

            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 border border-white/20 text-pearl rounded-lg font-sans text-sm uppercase tracking-wider hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-3 bg-electric text-white rounded-lg font-sans text-sm uppercase tracking-wider hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default ProductFormModal;
