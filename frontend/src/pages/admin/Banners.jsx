import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import BannerFormModal from '../../components/admin/BannerFormModal';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const fetchBanners = async () => {
    try {
      const { data } = await axios.get(import.meta.env.VITE_API_URL + '/banners/admin', { withCredentials: true });
      setBanners(data);
    } catch (error) {
      console.error('Failed to fetch banners', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/banners/${id}`, { withCredentials: true });
        fetchBanners();
      } catch (error) {
        console.error('Error deleting banner', error);
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleEdit = (banner) => {
    setSelectedBanner(banner);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedBanner(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display text-pearl mb-2">Banners</h1>
          <p className="text-gray-400 font-sans text-sm">Manage homepage dynamic banners.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-electric text-white font-sans font-medium uppercase tracking-wider py-3 px-6 rounded flex items-center gap-2 hover:bg-blue-600 transition-all shadow-[0_0_15px_rgba(100,181,246,0.2)]"
        >
          <Plus size={18} /> Add Banner
        </button>
      </div>

      <div className="bg-midnight border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-white/5 text-gray-400 uppercase tracking-widest text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Image</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500">Loading...</td></tr>
              ) : banners.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500">No banners found.</td></tr>
              ) : banners.map((banner) => (
                <motion.tr 
                  key={banner._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <img src={banner.image} alt={banner.title} className="w-24 h-12 object-cover rounded" />
                  </td>
                  <td className="px-6 py-4 text-pearl font-medium">{banner.title}</td>
                  <td className="px-6 py-4 text-gray-400">{banner.sortOrder}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs uppercase tracking-wider ${
                      banner.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                      'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {banner.isActive ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => handleEdit(banner)}
                        className="text-gray-500 hover:text-electric transition-colors" 
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(banner._id)}
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

      <BannerFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        banner={selectedBanner}
        onSuccess={fetchBanners}
      />
    </div>
  );
};

export default Banners;
