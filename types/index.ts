// types/index.ts - Global TypeScript type definitions

export interface User {
  id: number;
  email: string;
  role: 'admin' | 'staff' | 'manager';
  name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
  role: string;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Transaction {
  id: number;
  item_id: number;
  type: 'in' | 'out';
  quantity: number;
  user_id: number;
  notes?: string;
  created_at?: string;
}