import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/admin'); // Redirect to dashboard
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-crimson/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-electric/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative w-full max-w-md z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-midnight border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10"
        >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-electric/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-electric/20">
            <Lock className="text-electric" size={28} />
          </div>
          <h1 className="text-2xl font-display text-pearl tracking-wider">Admin Portal</h1>
          <p className="text-sm text-gray-500 font-sans mt-2">Sign in to manage ThreadMarket</p>
        </div>

        {error && (
          <div className="bg-crimson/10 border border-crimson/30 text-crimson text-sm font-sans p-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 font-sans mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-void border border-white/10 rounded px-4 py-3 text-pearl font-sans focus:outline-none focus:border-electric transition-colors"
              placeholder="admin@threadmarket.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 font-sans mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-void border border-white/10 rounded px-4 py-3 text-pearl font-sans focus:outline-none focus:border-electric transition-colors"
              placeholder="Enter your password"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-electric text-white font-sans font-medium uppercase tracking-wider py-3 rounded hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <button 
            onClick={() => navigate('/')} 
            className="text-sm text-gray-500 hover:text-pearl font-sans transition-colors"
          >
            ← Back to Home
          </button>
        </div>
        </motion.div>

        {/* Demo Credentials Side Card (Desktop) */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.3 }}
           className="hidden lg:block absolute top-1/2 -right-[280px] -translate-y-1/2 w-64 bg-midnight/80 backdrop-blur-md border border-electric/30 rounded-xl p-6 shadow-2xl z-0"
        >
          <h3 className="text-electric font-sans font-medium mb-3 flex items-center gap-2"><Lock size={16}/> Demo Access</h3>
          <p className="text-gray-400 text-sm font-sans mb-1">Email:</p>
          <p className="text-pearl font-mono text-sm mb-4 select-all">admin@threadmarket.com</p>
          <p className="text-gray-400 text-sm font-sans mb-1">Password:</p>
          <p className="text-pearl font-mono text-sm select-all">adminpassword123</p>
        </motion.div>

        {/* Demo Credentials (Mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:hidden mt-6 bg-midnight/80 border border-electric/30 rounded-xl p-4 text-center shadow-lg relative z-10"
        >
          <p className="text-electric font-sans text-sm mb-2 font-medium">Demo Access</p>
          <p className="text-pearl font-mono text-xs select-all">admin@threadmarket.com</p>
          <p className="text-pearl font-mono text-xs mt-1 select-all">adminpassword123</p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
