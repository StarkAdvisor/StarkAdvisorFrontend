import { useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials, RegisterData } from '../types';
import ApiService from '../services/api';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userId: number, updates: Partial<User>) => Promise<boolean>;
  checkSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const checkSession = useCallback(async () => {
    if (!ApiService.isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await ApiService.getSessionStatus();
      
      if (response.authenticated && response.user) {
        setUser(response.user);
      } else {
        setUser(null);
        ApiService.clearToken();
      }
    } catch (error: any) {
      console.error('Error checking session:', error);
      setUser(null);
      ApiService.clearToken();
      setError('Sesión expirada');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await ApiService.login(credentials);
      
      if (response.user) {
        setUser(response.user);
        return true;
      } else {
        setError('Credenciales incorrectas');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await ApiService.register(userData);
      
      if (response.user) {
        // No auto-login después del registro, redirigir a login
        return true;
      } else {
        setError('Error al crear la cuenta');
        return false;
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Manejar errores específicos del backend
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        
        // Crear mensaje de error específico basado en los errores del backend
        let errorMessage = 'Error en el registro:\n';
        
        if (backendErrors.email) {
          errorMessage += `• Email: ${backendErrors.email[0]}\n`;
        }
        if (backendErrors.username) {
          errorMessage += `• Usuario: ${backendErrors.username[0]}\n`;
        }
        if (backendErrors.password) {
          let passwordError = backendErrors.password[0];
          // Traducir errores comunes de contraseña
          if (passwordError.includes('too common')) {
            passwordError = 'Esta contraseña es muy común. Usa una más segura.';
          } else if (passwordError.includes('too short')) {
            passwordError = 'La contraseña debe tener al menos 8 caracteres.';
          } else if (passwordError.includes('numeric')) {
            passwordError = 'La contraseña no puede ser completamente numérica.';
          }
          errorMessage += `• Contraseña: ${passwordError}\n`;
        }
        if (backendErrors.phone_number) {
          errorMessage += `• Teléfono: ${backendErrors.phone_number[0]}\n`;
        }
        if (backendErrors.first_name) {
          errorMessage += `• Nombre: ${backendErrors.first_name[0]}\n`;
        }
        if (backendErrors.last_name) {
          errorMessage += `• Apellido: ${backendErrors.last_name[0]}\n`;
        }
        
        setError(errorMessage);
      } else {
        setError(error.message || 'Error al registrarse');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await ApiService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (userId: number, updates: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await ApiService.updateUser(userId, updates);
      
      if (response.user) {
        setUser(response.user);
        return true;
      } else {
        setError('Error al actualizar el perfil');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Error al actualizar el perfil');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    checkSession,
    clearError
  };
};
