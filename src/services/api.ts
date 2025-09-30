import axios, { AxiosResponse } from 'axios';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  SessionResponse, 
  User,
  ApiError
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const TOKEN_KEY = 'starkadvisor_token';

// Configuración de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export class ApiService {
  // Autenticación
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await apiClient.post(
        '/user_admin/login/',
        credentials
      );
      
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await apiClient.post(
        '/user_admin/register/',
        {
          ...userData,
          phone_number: userData.phone_number || "",
          date_of_birth: userData.date_of_birth || null
        }
      );
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post('/user_admin/logout/');
    } catch (error) {
      // Ignorar errores de logout, limpiar token de todas formas
    } finally {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  static async getSessionStatus(): Promise<SessionResponse> {
    try {
      const response: AxiosResponse<SessionResponse> = await apiClient.get(
        '/user_admin/session-status/'
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async updateUser(userId: number, updates: Partial<User>): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await apiClient.put(
        `/user_admin/users/${userId}/update/`,
        updates
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Gestión de tokens
  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  // Manejo de errores
  private static handleError(error: any): ApiError {
    if (error.response?.data) {
      const errorData = error.response.data;
      
      // Si hay errores de campo específicos
      if (typeof errorData === 'object' && !errorData.message) {
        const fieldErrors: string[] = [];
        for (const [field, messages] of Object.entries(errorData)) {
          if (Array.isArray(messages)) {
            fieldErrors.push(`${field}: ${messages.join(', ')}`);
          } else {
            fieldErrors.push(`${field}: ${messages}`);
          }
        }
        
        return {
          message: fieldErrors.join('; '),
          errors: errorData
        };
      }
      
      return {
        message: errorData.message || errorData.error || 'Error del servidor',
        errors: errorData.errors
      };
    }
    
    if (error.message) {
      return { message: error.message };
    }
    
    return { message: 'Error de conexión con el servidor' };
  }
}

export default ApiService;
