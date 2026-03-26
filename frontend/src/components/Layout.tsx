import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/hooks/useAuth';
export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const nav = [{ path: '/products', label: 'Products' }, { path: '/orders', label: 'Orders' }];
  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              {nav.map((item) => <Link key={item.path} to={item.path} className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${location.pathname === item.path ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{item.label}</Link>)}
            </div>
            <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">Logout</button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
