import { apiFetch } from './api';
import type { AuthResponse, ApiResponse } from '../../../shared/types';
export const login = (username: string, password: string): Promise<ApiResponse<AuthResponse>> => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
export const register = (username: string, password: string): Promise<ApiResponse<AuthResponse>> => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ username, password }) });
