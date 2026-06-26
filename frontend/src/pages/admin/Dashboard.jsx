import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { DollarSign, ShoppingBag, Users, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [statsData, setStatsData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(import.meta.env.VITE_API_URL + '/stats/admin', { withCredentials: true });
        
        // Map icons back to stats
        const iconMap = {
          'Total Revenue': <DollarSign size={24} className="text-electric" />,
          'Total Orders': <ShoppingBag size={24} className="text-gold" />,
          'Active Customers': <Users size={24} className="text-blue-400" />,
          'Low Stock Items': <AlertTriangle size={24} className="text-crimson" />,
        };

        const mappedStats = data.stats.map(stat => ({
          ...stat,
          icon: iconMap[stat.title] || <DollarSign size={24} className="text-electric" />
        }));

        setStatsData(mappedStats);
        setRevenueData(data.revenueData);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-pearl font-sans">Loading Dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-display text-pearl mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <motion.div 
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-midnight border border-white/5 rounded-xl p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-lg">
                {stat.icon}
              </div>
              <span className={`text-sm font-mono ${stat.trend.startsWith('+') ? 'text-green-400' : 'text-crimson'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-gray-400 font-sans text-sm">{stat.title}</h3>
            <p className="text-2xl font-display text-pearl mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-midnight border border-white/5 rounded-xl p-6"
        >
          <h3 className="text-lg font-sans text-pearl mb-6">Revenue Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} tickFormatter={(val) => `Rs.${val/1000}k`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#64b5f6' }}
                />
                <Bar dataKey="total" fill="#64b5f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Order Trend Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-midnight border border-white/5 rounded-xl p-6"
        >
          <h3 className="text-lg font-sans text-pearl mb-6">Orders Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#c6a84b' }}
                />
                <Line type="monotone" dataKey="total" stroke="#c6a84b" strokeWidth={3} dot={{ fill: '#c6a84b', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Dashboard;
