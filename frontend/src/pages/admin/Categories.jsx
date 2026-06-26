import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import CategoryFormModal from '../../components/admin/CategoryFormModal';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(import.meta.env.VITE_API_URL + '/categories');
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? (Make sure no products are using it)')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/categories/${id}`, { withCredentials: true });
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category', error);
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display text-pearl mb-2">Categories</h1>
          <p className="text-gray-400 font-sans text-sm">Manage product categories and collections.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-electric text-white font-sans font-medium uppercase tracking-wider py-3 px-6 rounded flex items-center gap-2 hover:bg-blue-600 transition-all shadow-[0_0_15px_rgba(100,181,246,0.2)]"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="bg-midnight border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-white/5 text-gray-400 uppercase tracking-widest text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-8 text-gray-500">Loading...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-8 text-gray-500">No categories found.</td></tr>
              ) : categories.map((category) => (
                <motion.tr 
                  key={category._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-pearl font-medium">{category.name}</td>
                  <td className="px-6 py-4 text-gray-400">{category.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs uppercase tracking-wider ${
                      category.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                      'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {category.isActive ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => handleEdit(category)}
                        className="text-gray-500 hover:text-electric transition-colors" 
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(category._id)}
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
      </div>

      <CategoryFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        onSuccess={fetchCategories}
      />
    </div>
  );
};

export default Categories;
