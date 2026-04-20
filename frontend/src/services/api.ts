// src/services/api.ts
import type { ApiResponse } from '@/types';

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';

export async function fetchData<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  const result: ApiResponse<T> = await response.json();
  return result.data;
}
