import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, Trash2, Mail, Calendar } from 'lucide-react';
import axios from 'axios';

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(import.meta.env.VITE_API_URL + '/users', { withCredentials: true });
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, email) => {
    if (email === 'admin@threadmarket.com') {
      alert('Cannot delete the super admin!');
      return;
    }
    if (window.confirm(`Are you sure you want to delete user ${email}?`)) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`, { withCredentials: true });
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleRoleChange = async (id, currentRole, email) => {
    if (email === 'admin@threadmarket.com') {
      alert('Cannot change the role of the super admin!');
      return;
    }
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    if (window.confirm(`Are you sure you want to make ${email} a ${newRole}?`)) {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/users/${id}/role`, { role: newRole }, { withCredentials: true });
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.message || 'Role update failed');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-display text-pearl">Customers & Admins</h1>
        <p className="text-gray-400 font-sans mt-2">Manage registered users and staff permissions</p>
      </div>

      <div className="bg-midnight border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-white/5 text-gray-400 uppercase tracking-widest text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500">Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500">No users found.</td></tr>
              ) : users.map((user) => (
                <motion.tr 
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-pearl font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-electric/20 flex items-center justify-center text-electric font-display text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-electric" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-electric" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs uppercase tracking-wider ${
                      user.role === 'admin' 
                        ? 'bg-electric/10 text-electric border border-electric/20' 
                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => handleRoleChange(user._id, user.role, user.email)}
                        className={`text-gray-500 transition-colors ${user.role === 'admin' ? 'hover:text-yellow-500' : 'hover:text-electric'}`} 
                        title={user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                        disabled={user.email === 'admin@threadmarket.com'}
                      >
                        {user.role === 'admin' ? <ShieldAlert size={18} /> : <Shield size={18} />}
                      </button>
                      <button 
                        onClick={() => handleDelete(user._id, user.email)}
                        className="text-gray-500 hover:text-crimson transition-colors" 
                        title="Delete User"
                        disabled={user.email === 'admin@threadmarket.com'}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Customers;
