import { apiFetch } from './api';
import type { LoginResult, ApiResponse } from '@shared/types';

export const login = (username: string, password: string): Promise<ApiResponse<LoginResult>> =>
  apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });

export const register = (username: string, password: string): Promise<ApiResponse<LoginResult>> =>
  apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ username, password }) });
