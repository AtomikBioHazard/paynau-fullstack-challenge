import { useAuthStore } from '@/hooks/useAuth';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function apiFetch<T>(
  endpoint: string, 
  options: RequestInit = {}, 
  signal?: AbortSignal
): Promise<{ success: boolean; data?: T; pagination?: { page: number; limit: number; total: number; totalPages: number }; error?: string; status: number }> {
  const token = useAuthStore.getState().token;
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { 
      'Content-Type': 'application/json', 
      ...(token && { Authorization: `Bearer ${token}` }), 
      ...options.headers 
    },
    signal,
  });

  if (response.status === 401) { 
    useAuthStore.getState().logout(); 
    return { success: false, error: 'Session expired', status: 401 }; 
  }

  const jsonData = await response.json().catch(() => null);
  
  if (!response.ok) return { success: false, error: jsonData?.error || `HTTP ${response.status}`, status: response.status };
  
  return { 
    success: jsonData?.success ?? true, 
    data: jsonData?.data, 
    pagination: jsonData?.pagination,
    status: response.status 
  };
}
