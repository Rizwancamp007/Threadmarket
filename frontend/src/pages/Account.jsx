import { motion } from 'framer-motion';
import { User, Package, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import SEO from '../components/SEO';

const Account = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display text-pearl mb-4">Please log in to view your account.</h2>
          <button onClick={() => navigate('/admin/login')} className="text-electric border-b border-electric">Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-transparent">
      <SEO title="My Account | ThreadMarket" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-display text-pearl mb-10">
            Welcome back, <span className="text-electric">{user.name}</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-1 space-y-2"
          >
            <button className="w-full flex items-center space-x-3 p-4 bg-white/5 border border-white/10 rounded-lg text-pearl hover:bg-electric hover:border-electric transition-all">
              <User size={20} />
              <span className="font-sans">Profile</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 border border-transparent rounded-lg text-gray-400 hover:bg-white/5 hover:text-pearl transition-all">
              <Package size={20} />
              <span className="font-sans">Orders</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 border border-transparent rounded-lg text-gray-400 hover:bg-white/5 hover:text-pearl transition-all">
              <Settings size={20} />
              <span className="font-sans">Settings</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-4 border border-transparent rounded-lg text-crimson hover:bg-crimson/10 transition-all mt-8"
            >
              <LogOut size={20} />
              <span className="font-sans">Logout</span>
            </button>
          </motion.div>

          {/* Main Content Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-3 bg-midnight/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          >
            <h2 className="text-2xl font-display text-gold mb-6 flex items-center gap-3">
              Profile Details
              {user.isAdmin && <ShieldCheck className="text-electric" size={24} />}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-sans">Full Name</label>
                <div className="p-4 bg-void border border-white/5 rounded-lg text-pearl font-sans">{user.name}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-sans">Email Address</label>
                <div className="p-4 bg-void border border-white/5 rounded-lg text-pearl font-sans">{user.email}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Account;
