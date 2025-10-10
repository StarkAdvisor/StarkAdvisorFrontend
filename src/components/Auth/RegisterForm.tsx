import React, { useState, useEffect } from 'react';
import { RegisterData, RiskProfile } from '../../types';
import '../../styles/official-design.css';

interface RegisterFormProps {
  onRegister: (userData: RegisterData) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  onSwitchToLogin: () => void;
}

interface FormErrors {
  email?: string;
  username?: string;
  password?: string;
  password_confirm?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  date_of_birth?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  isLoading,
  error,
  onSwitchToLogin
}) => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    username: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    risk_profile: 'moderate',
    phone_number: '',
    date_of_birth: '',
    avatar: null
  });

  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Efecto para manejar errores del backend y mapearlos a campos específicos
  useEffect(() => {
    if (error) {
      const backendErrors: FormErrors = {};
      
      // Parsear errores del backend si vienen en formato específico
      if (error.includes('Email:')) {
        const emailMatch = error.match(/Email: ([^\n]+)/);
        if (emailMatch) backendErrors.email = emailMatch[1];
      }
      
      if (error.includes('Usuario:')) {
        const usernameMatch = error.match(/Usuario: ([^\n]+)/);
        if (usernameMatch) backendErrors.username = usernameMatch[1];
      }
      
      if (error.includes('Contraseña:')) {
        const passwordMatch = error.match(/Contraseña: ([^\n]+)/);
        if (passwordMatch) backendErrors.password = passwordMatch[1];
      }
      
      if (error.includes('Teléfono:')) {
        const phoneMatch = error.match(/Teléfono: ([^\n]+)/);
        if (phoneMatch) backendErrors.phone_number = phoneMatch[1];
      }
      
      if (error.includes('Nombre:')) {
        const nameMatch = error.match(/Nombre: ([^\n]+)/);
        if (nameMatch) backendErrors.first_name = nameMatch[1];
      }
      
      if (error.includes('Apellido:')) {
        const lastNameMatch = error.match(/Apellido: ([^\n]+)/);
        if (lastNameMatch) backendErrors.last_name = lastNameMatch[1];
      }
      
      // Solo actualizar errores si encontramos errores específicos del backend
      if (Object.keys(backendErrors).length > 0) {
        setFieldErrors(prev => ({ ...prev, ...backendErrors }));
      }
    }
  }, [error]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username: string): boolean => {
    return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
  };

  const validatePassword = (password: string): boolean => {
    // Lista de contraseñas comunes para evitar
    const commonPasswords = [
      '12345678', '123456789', '1234567890',
      'password', 'password123', 'qwerty', 'abc123',
      'admin', 'user', 'test', 'demo',
      'asd12345', 'asdf1234', 'qwe12345'
    ];
    
    return password.length >= 8 && 
           !/^\d+$/.test(password) && // No solo números
           !commonPasswords.includes(password.toLowerCase()) && // No contraseñas comunes
           !/^[a-zA-Z]+$/.test(password) && // No solo letras
           /^(?=.*[a-zA-Z])(?=.*\d).+$/.test(password); // Al menos una letra y un número
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validación de nombre
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'El nombre es requerido';
    }

    // Validación de apellido
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'El apellido es requerido';
    }

    // Validación de email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Ingrese un email válido';
    }

    // Validación de usuario
    if (!formData.username.trim()) {
      newErrors.username = 'El usuario es requerido';
    } else if (!validateUsername(formData.username)) {
      newErrors.username = 'Usuario debe tener al menos 3 caracteres y solo letras, números y _';
    }

    // Validación de contraseña con mensajes específicos
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una letra y un número';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Esta contraseña es muy común. Usa una más segura.';
    }

    // Validación de confirmación de contraseña
    if (!formData.password_confirm.trim()) {
      newErrors.password_confirm = 'Confirme su contraseña';
    } else if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'Las contraseñas no coinciden';
    }

    // Validación opcional de teléfono - solo si se proporciona
    if (formData.phone_number && formData.phone_number.trim()) {
      // Formato: cualquier código de país (+1 a +999) seguido de exactamente 10 dígitos
      const phoneRegex = /^\+\d{1,3}\d{10}$/;
      const cleanPhone = formData.phone_number.replace(/\s|-/g, ''); // Remover espacios y guiones
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone_number = 'El telefono debe tener código de país + 10 dígitos (ej: +57 3001234567, +1 2025551234)';
      }
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación frontend primero
    if (!validateForm()) {
      return;
    }

    try {
      const success = await onRegister({
        ...formData,
        email: formData.email.trim(),
        username: formData.username.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim()
      });
      
      if (success) {
        // Solo limpiar el formulario si el registro fue exitoso
        setFormData({
          email: '',
          username: '',
          password: '',
          password_confirm: '',
          first_name: '',
          last_name: '',
          risk_profile: 'moderate',
          phone_number: '',
          date_of_birth: '',
          avatar: null
        });
        setFieldErrors({});
        onSwitchToLogin();
      }
      // Si success es false, mantener todos los datos del usuario
    } catch (error) {
      // En caso de error, mantener todos los datos del formulario
      console.error('Error en registro:', error);
    }
  };

  const handleChange = (field: keyof RegisterData, value: string | RiskProfile | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (fieldErrors[field as keyof FormErrors]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Función para limpiar todos los errores
  const clearErrors = () => {
    setFieldErrors({});
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
      padding: '24px 16px'
    }}>
      <div className="w-full" style={{ maxWidth: '500px' }}>
        <div style={{
          backgroundColor: 'var(--color-white)',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid var(--color-gray-light)',
          margin: '0 auto',
          animation: 'slideUp 0.6s ease-out',
          transform: 'translateY(0)'
        }}>
          {/* Logo y título */}
          <div className="text-center" style={{ marginBottom: '32px' }}>
            <h1 style={{
              color: 'var(--color-primary)',
              fontSize: '28px',
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: '8px',
              letterSpacing: '0.5px'
            }}>
              STARKADVISOR
            </h1>
            <h2 style={{
              color: 'var(--color-black)',
              fontSize: '22px',
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: '8px'
            }}>
              Crear Cuenta
            </h2>
            <p style={{
              color: 'var(--color-gray-medium)',
              fontSize: '14px',
              margin: '0'
            }}>
              Únete a la plataforma financiera de próxima generación
            </p>
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
            {/* Nombre y Apellido */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label htmlFor="first_name" className="form-label">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  className="form-input"
                  placeholder="Su nombre"
                  disabled={isLoading}
                  style={{
                    borderColor: fieldErrors.first_name ? 'var(--color-error)' : undefined
                  }}
                  required
                />
                {fieldErrors.first_name && (
                  <p style={{
                    color: 'var(--color-error)',
                    fontSize: 'var(--font-size-small)',
                    fontWeight: 'var(--font-weight-semibold)',
                    marginTop: '8px'
                  }}>
                    {fieldErrors.first_name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="form-label">
                  Apellido *
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  className="form-input"
                  placeholder="Su apellido"
                  disabled={isLoading}
                  style={{
                    borderColor: fieldErrors.last_name ? 'var(--color-error)' : undefined
                  }}
                  required
                />
                {fieldErrors.last_name && (
                  <p style={{
                    color: 'var(--color-error)',
                    fontSize: 'var(--font-size-small)',
                    fontWeight: 'var(--font-weight-semibold)',
                    marginTop: '8px'
                  }}>
                    {fieldErrors.last_name}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="form-input"
                placeholder="su@email.com"
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

            {/* Usuario */}
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Usuario *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                className="form-input"
                placeholder="su_usuario"
                disabled={isLoading}
                style={{
                  borderColor: fieldErrors.username ? 'var(--color-error)' : undefined
                }}
                required
              />
              {fieldErrors.username && (
                <p style={{
                  color: 'var(--color-error)',
                  fontSize: 'var(--font-size-small)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginTop: '8px'
                }}>
                  {fieldErrors.username}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="form-input"
                  placeholder="Su contraseña"
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
              {!fieldErrors.password && (
                <p style={{
                  color: 'var(--color-gray-medium)',
                  fontSize: 'var(--font-size-small)',
                  marginTop: '4px'
                }}>
                  Mínimo 8 caracteres, incluye letras y números. Evita contraseñas comunes.
                </p>
              )}
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

            {/* Confirmar contraseña */}
            <div className="mb-3">
              <label htmlFor="password_confirm" className="form-label">
                Confirmar Contraseña *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="password_confirm"
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={(e) => handleChange('password_confirm', e.target.value)}
                  className="form-input"
                  placeholder="Confirme su contraseña"
                  disabled={isLoading}
                  style={{
                    borderColor: fieldErrors.password_confirm ? 'var(--color-error)' : undefined,
                    paddingRight: '48px'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  {showConfirmPassword ? 'OCULTAR' : 'MOSTRAR'}
                </button>
              </div>
              {fieldErrors.password_confirm && (
                <p style={{
                  color: 'var(--color-error)',
                  fontSize: 'var(--font-size-small)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginTop: '8px'
                }}>
                  {fieldErrors.password_confirm}
                </p>
              )}
            </div>

            {/* Perfil de Riesgo */}
            <div className="mb-3">
              <label htmlFor="risk_profile" className="form-label">
                Perfil de Riesgo *
              </label>
              <select
                id="risk_profile"
                name="risk_profile"
                value={formData.risk_profile}
                onChange={(e) => handleChange('risk_profile', e.target.value as RiskProfile)}
                className="form-input"
                disabled={isLoading}
                style={{
                  cursor: 'pointer'
                }}
              >
                <option value="conservative">Conservador - Bajo riesgo, retornos estables</option>
                <option value="moderate">Moderado - Balance entre riesgo y retorno</option>
                <option value="aggressive">Agresivo - Alto riesgo, potencial alto retorno</option>
              </select>
            </div>

            {/* Información Opcional */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label htmlFor="phone_number" className="form-label">
                  Teléfono (Opcional)
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number || ''}
                  onChange={(e) => handleChange('phone_number', e.target.value)}
                  className="form-input"
                  placeholder="+57 3001234567"
                  disabled={isLoading}
                  style={{
                    borderColor: fieldErrors.phone_number ? 'var(--color-error)' : undefined
                  }}
                />
                {!fieldErrors.phone_number && (
                  <p style={{
                    color: 'var(--color-gray-medium)',
                    fontSize: 'var(--font-size-small)',
                    marginTop: '4px'
                  }}>
                    Formato: código de país + 10 dígitos (ej: +573001234567, +12025551234)
                  </p>
                )}
                {fieldErrors.phone_number && (
                  <p style={{
                    color: 'var(--color-error)',
                    fontSize: 'var(--font-size-small)',
                    fontWeight: 'var(--font-weight-semibold)',
                    marginTop: '8px'
                  }}>
                    {fieldErrors.phone_number}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="date_of_birth" className="form-label">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth || ''}
                  onChange={(e) => handleChange('date_of_birth', e.target.value)}
                  className="form-input"
                  max={new Date().toISOString().split('T')[0]}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Botón de submit */}
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
              style={{
                marginBottom: '24px',
                padding: '14px',
                fontSize: '16px',
                fontWeight: 'var(--font-weight-semibold)',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
            </button>
          </form>

          {/* Enlace para iniciar sesión */}
          <div className="text-center">
            <p style={{
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-gray-medium)',
              marginBottom: '8px'
            }}>
              ¿Ya tienes una cuenta?
            </p>
            <button
              onClick={onSwitchToLogin}
              className="btn-secondary"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: 'var(--font-weight-semibold)',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              INICIAR SESIÓN
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

export default RegisterForm;
