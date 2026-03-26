import { useState } from 'react';
import { useAuthStore } from '@/hooks/useAuth';
import * as authService from '@/services/authService';
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setToken = useAuthStore((s) => s.setToken);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await authService.login(username, password);
    if (result.success && result.data) setToken(result.data.token);
    else setError(result.error || 'Authentication error');
    setLoading(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div><h2 className="text-center text-3xl font-bold text-gray-900">Paynau</h2></div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}
          <div><label className="block text-sm font-medium text-gray-700">Username</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required/></div>
          <div><label className="block text-sm font-medium text-gray-700">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required/></div>
          <button type="submit" disabled={loading} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">{loading ? 'Loading...' : 'Sign In'}</button>
        </form>
      </div>
    </div>
  );
}
