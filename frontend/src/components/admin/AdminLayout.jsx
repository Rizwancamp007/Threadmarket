import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Tags, Image, Home } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const AdminLayout = () => {
  const location = useLocation();
  const { logout } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Orders (Kanban)', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Tags size={20} /> },
    { name: 'Banners', path: '/admin/banners', icon: <Image size={20} /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-void text-pearl font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-midnight border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="text-xl font-display font-bold tracking-wider text-pearl">
            THREAD<span className="text-gold">MARKET</span>
          </Link>
          <div className="text-xs text-electric tracking-widest uppercase mt-1">Admin Panel</div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-electric/10 text-electric font-medium border border-electric/20'
                  : 'text-gray-400 hover:text-pearl hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link 
            to="/"
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-pearl hover:bg-white/5 rounded-lg transition-colors"
          >
            <Home size={20} />
            Back to Site
          </Link>
          <button 
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-crimson hover:bg-crimson/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-void p-8 relative">
        {/* Background glow */}
        <div className="fixed top-0 right-0 w-96 h-96 bg-electric/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
