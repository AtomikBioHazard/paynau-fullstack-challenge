import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/hooks/useAuth';
import * as authService from '@/services/authService';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const navigate = useNavigate();
  const { token, setToken } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    if (loginSuccess && token) {
      navigate('/products', { replace: true });
    }
  }, [loginSuccess, token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await authService.login(username, password);
    
    if (!result.success || !result.data) {
      setError(result.error || 'Authentication error');
      setLoading(false);
      return;
    }
    
    setToken(result.data.token);
    setLoginSuccess(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {
      /* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-teal-100/20 rounded-full blur-2xl"></div>

      {
      /* Floating cards - estilo Paynau */}
      <div className="absolute top-24 right-16 bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-gray-100 shadow-xl shadow-blue-900/5 transform rotate-3 hover:rotate-0 transition-all duration-500">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-400/30">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Processed</p>
            <p className="text-slate-800 font-bold text-xl">US$40+ BN</p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-32 left-16 bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-gray-100 shadow-xl shadow-blue-900/5 transform -rotate-2 hover:rotate-0 transition-all duration-500">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-400/30">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Countries</p>
            <p className="text-slate-800 font-bold text-xl">13+</p>
          </div>
        </div>
      </div>

      {
      /* Main login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 border border-gray-100 shadow-2xl shadow-slate-900/10">
          {
          /* Logo con fondo oscuro para que se vea */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
              <Logo className="h-8 w-auto" />
            </div>
          </div>

          {
          /* Title - ahora oscuro y visible */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Welcome back</h2>
            <p className="text-slate-500 text-base">Sign in to manage your orders and products</p>
          </div>

          {
          /* Form - inputs visibles con fondo claro */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm">{error}</div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/30"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {
          /* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-sm">Demo credentials: <span className="font-medium text-slate-600">admin / admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
