export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  risk_profile: RiskProfile;
  date_joined: string;
  phone_number?: string;
  date_of_birth?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  risk_profile: RiskProfile;
  phone_number?: string;
  date_of_birth?: string | null;
  avatar?: File | null;
}

export interface AuthResponse {
  message: string;
  user?: User;
  token?: string;
  success?: boolean;
}

export interface SessionResponse {
  authenticated: boolean;
  user?: User;
  session_data?: any;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
