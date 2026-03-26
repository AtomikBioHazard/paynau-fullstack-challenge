import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/hooks/useAuth';
import Logo from '@/components/Logo';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);
  
  const nav = [
    { path: '/products', label: 'Products' },
    { path: '/orders', label: 'Orders' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link to="/products" className="flex items-center">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-2 hover:opacity-90 transition-opacity">
                  <Logo className="h-6 w-auto" />
                </div>
              </Link>
              
              <div className="flex space-x-1 ml-8">
                {nav.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      location.pathname === item.path
                        ? 'bg-teal-50 text-teal-700 border border-teal-100'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            
            <button 
              onClick={logout} 
              className="text-slate-500 hover:text-slate-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
