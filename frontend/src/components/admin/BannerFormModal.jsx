import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, XCircle } from 'lucide-react';
import axios from 'axios';

const BannerFormModal = ({ isOpen, onClose, banner, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    link: '',
    sortOrder: 0,
    isActive: true,
  });
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        link: banner.link || '',
        sortOrder: banner.sortOrder || 0,
        isActive: banner.isActive !== undefined ? banner.isActive : true,
      });
      setImage(banner.image || '');
    } else {
      setFormData({
        title: '',
        subtitle: '',
        link: '',
        sortOrder: 0,
        isActive: true,
      });
      setImage('');
    }
  }, [banner, isOpen]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const { data } = await axios.post(import.meta.env.VITE_API_URL + '/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
    if (!image) {
      setError('An image is required for the banner');
      return;
    }
    setLoading(true);
    setError('');

    const submissionData = { ...formData, image };

    try {
      if (banner) {
        await axios.put(`${import.meta.env.VITE_API_URL}/banners/${banner._id}`, submissionData, {
          withCredentials: true,
        });
      } else {
        await axios.post(import.meta.env.VITE_API_URL + '/banners', submissionData, {
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
            {banner ? 'Edit Banner' : 'Add New Banner'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && <div className="p-4 bg-crimson/10 border border-crimson text-crimson rounded-lg">{error}</div>}

          <div>
            <label className="block text-sm font-sans text-gray-400 mb-2">Banner Image (Wide aspect ratio recommended) *</label>
            <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center">
              {image ? (
                <div className="relative inline-block">
                  <img src={image} alt="Preview" className="h-32 object-cover rounded" />
                  <button 
                    type="button" 
                    onClick={() => setImage('')} 
                    className="absolute -top-2 -right-2 bg-void text-white rounded-full p-1"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              ) : (
                <div className="py-4">
                  <Upload className="mx-auto text-gray-500 mb-2" size={24} />
                  <input 
                    type="file" 
                    id="banner-image-upload" 
                    className="hidden" 
                    onChange={uploadFileHandler}
                    accept="image/*"
                  />
                  <label 
                    htmlFor="banner-image-upload" 
                    className="bg-white/5 border border-white/10 px-4 py-2 rounded text-pearl text-sm cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    {uploading ? 'Uploading...' : 'Choose File'}
                  </label>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-sans text-gray-400 mb-2">Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-pearl focus:outline-none focus:border-electric transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-sans text-gray-400 mb-2">Subtitle</label>
            <input 
              type="text" 
              value={formData.subtitle}
              onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
              className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-pearl focus:outline-none focus:border-electric transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-sans text-gray-400 mb-2">Link (e.g., /shop)</label>
            <input 
              type="text" 
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
              className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-pearl focus:outline-none focus:border-electric transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-sans text-gray-400 mb-2">Sort Order</label>
            <input 
              type="number" 
              value={formData.sortOrder}
              onChange={(e) => setFormData({...formData, sortOrder: e.target.value})}
              className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-pearl focus:outline-none focus:border-electric transition-colors font-mono"
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
              {loading ? 'Saving...' : 'Save Banner'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default BannerFormModal;
