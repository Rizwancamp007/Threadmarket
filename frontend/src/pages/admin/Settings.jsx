import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save } from 'lucide-react';

const Settings = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display text-pearl">Store Settings</h1>
          <p className="text-gray-400 font-sans mt-2">Manage your platform configuration</p>
        </div>
        <button className="bg-electric text-white px-6 py-2 rounded-lg font-sans flex items-center space-x-2 hover:bg-blue-600 transition-colors">
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="bg-void border border-white/10 rounded-2xl p-8 max-w-4xl">
        <div className="flex items-center space-x-4 mb-6 border-b border-white/10 pb-6">
          <div className="w-12 h-12 rounded-full bg-electric/20 flex items-center justify-center text-electric">
            <SettingsIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-display text-pearl">General Preferences</h2>
            <p className="text-sm text-gray-500 font-sans">Coming soon: Full store configuration settings.</p>
          </div>
        </div>
        
        <div className="space-y-6 opacity-50 pointer-events-none">
          <div>
            <label className="block text-sm text-gray-400 font-sans mb-2">Store Name</label>
            <input type="text" value="ThreadMarket SaaS" readOnly className="w-full bg-midnight border border-white/10 rounded-lg px-4 py-2 text-pearl font-sans" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 font-sans mb-2">Support Email</label>
            <input type="email" value="support@threadmarket.com" readOnly className="w-full bg-midnight border border-white/10 rounded-lg px-4 py-2 text-pearl font-sans" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 font-sans mb-2">Currency</label>
            <input type="text" value="PKR (₨)" readOnly className="w-full bg-midnight border border-white/10 rounded-lg px-4 py-2 text-pearl font-sans" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
