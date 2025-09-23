import React, { useState } from 'react';
import { LoginCredentials } from '../../types';
import '../../styles/official-design.css';

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  onSwitchToRegister: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  isLoading,
  error,
  onSwitchToRegister
}) => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });

  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validación de email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Ingrese un email válido';
    }

    // Validación de contraseña
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onLogin({
      email: formData.email.trim(),
      password: formData.password
    });
  };

  const handleChange = (field: keyof LoginCredentials, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--color-white)' }}>
      <div className="w-full max-w-md">
        <div style={{
          backgroundColor: 'var(--color-white)',
          padding: '32px',
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          border: '1px solid var(--color-gray-light)'
        }}>
          {/* Logo y título */}
          <div className="text-center mb-4">
            <h1 style={{
              color: 'var(--color-primary)',
              fontSize: 'var(--font-size-h1)',
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: '8px'
            }}>
              STARKADVISOR
            </h1>
            <h2 style={{
              color: 'var(--color-black)',
              fontSize: 'var(--font-size-h2)',
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: '24px'
            }}>
              Iniciar Sesión
            </h2>
          </div>

          {/* Error general */}
          {error && (
            <div style={{
              backgroundColor: '#FFEBEE',
              color: 'var(--color-error)',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '24px',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-semibold)',
              border: '1px solid var(--color-error)'
            }}>
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Campo Email */}
            <div className="mb-3">
              <label 
                htmlFor="email" 
                className="form-label"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="form-input"
                placeholder="Ingrese su email"
                disabled={isLoading}
                style={{
                  borderColor: fieldErrors.email ? 'var(--color-error)' : undefined
                }}
                required
              />
              {fieldErrors.email && (
                <p style={{
                  color: 'var(--color-error)',
                  fontSize: 'var(--font-size-small)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginTop: '8px'
                }}>
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div className="mb-4">
              <label 
                htmlFor="password" 
                className="form-label"
              >
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="form-input"
                  placeholder="Ingrese su contraseña"
                  disabled={isLoading}
                  style={{
                    borderColor: fieldErrors.password ? 'var(--color-error)' : undefined,
                    paddingRight: '48px'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-gray-medium)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-small)',
                    fontWeight: 'var(--font-weight-semibold)'
                  }}
                  disabled={isLoading}
                >
                  {showPassword ? 'OCULTAR' : 'MOSTRAR'}
                </button>
              </div>
              {fieldErrors.password && (
                <p style={{
                  color: 'var(--color-error)',
                  fontSize: 'var(--font-size-small)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginTop: '8px'
                }}>
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Botón de submit */}
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
              style={{
                marginBottom: '24px'
              }}
            >
              {isLoading ? 'INICIANDO SESIÓN...' : 'INICIAR SESIÓN'}
            </button>
          </form>

          {/* Enlace para registrarse */}
          <div className="text-center">
            <p style={{
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-gray-medium)',
              marginBottom: '8px'
            }}>
              ¿No tienes una cuenta?
            </p>
            <button
              onClick={onSwitchToRegister}
              className="btn-secondary"
              disabled={isLoading}
              style={{
                width: '100%'
              }}
            >
              CREAR CUENTA
            </button>
          </div>
        </div>

        {/* Footer información */}
        <div className="text-center mt-4">
          <p style={{
            fontSize: 'var(--font-size-small)',
            color: 'var(--color-gray-medium)',
            fontWeight: 'var(--font-weight-regular)'
          }}>
            Plataforma de Asesoría Financiera
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
