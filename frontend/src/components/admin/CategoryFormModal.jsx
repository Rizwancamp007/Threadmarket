import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import axios from 'axios';

const CategoryFormModal = ({ isOpen, onClose, category, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        image: category.image || '',
        isActive: category.isActive !== undefined ? category.isActive : true,
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        image: '',
        isActive: true,
      });
    }
  }, [category, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Auto-generate slug if empty
    const submissionData = { ...formData };
    if (!submissionData.slug) {
      submissionData.slug = submissionData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    try {
      if (category) {
        await axios.put(`http://localhost:5000/api/categories/${category._id}`, submissionData, {
          withCredentials: true,
        });
      } else {
        await axios.post('http://localhost:5000/api/categories', submissionData, {
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
        className="relative bg-midnight border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl z-10"
      >
        <div className="bg-midnight/90 border-b border-white/10 p-6 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-display text-pearl">
            {category ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-4 bg-crimson/10 border border-crimson text-crimson rounded-lg">{error}</div>}

          <div>
            <label className="block text-sm font-sans text-gray-400 mb-2">Category Name *</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-pearl focus:outline-none focus:border-electric transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-sans text-gray-400 mb-2">Slug (Auto-generated if empty)</label>
            <input 
              type="text" 
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              placeholder="e.g., formals"
              className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-pearl focus:outline-none focus:border-electric transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-sans text-gray-400 mb-2">Description</label>
            <textarea 
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-pearl focus:outline-none focus:border-electric transition-colors resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-sans text-gray-400 mb-2">Icon/Image (Optional)</label>
            <input 
              type="text" 
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              placeholder="Lucide Icon Name or URL"
              className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-pearl focus:outline-none focus:border-electric transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input 
              type="checkbox" 
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="w-5 h-5 accent-electric rounded cursor-pointer"
            />
            <span className="text-pearl font-sans text-sm cursor-pointer" onClick={() => setFormData({...formData, isActive: !formData.isActive})}>
              Active (Visible on public site)
            </span>
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
              {loading ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CategoryFormModal;
