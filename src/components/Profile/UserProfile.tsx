import React, { useState } from 'react';
import { User, RiskProfile } from '../../types';
import '../../styles/official-design.css';

interface UserProfileProps {
  user: User;
  onUpdateProfile?: (updates: Partial<User>) => Promise<boolean>;
  onChangePassword?: (currentPassword: string, newPassword: string) => Promise<boolean>;
  isLoading?: boolean;
}

interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone_number: string;
  date_of_birth: string;
  risk_profile: RiskProfile;
}

interface PasswordFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface FormErrors {
  [key: string]: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onUpdateProfile,
  onChangePassword,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [profileData, setProfileData] = useState<ProfileFormData>({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    username: user.username || '',
    phone_number: user.phone_number || '',
    date_of_birth: user.date_of_birth || '',
    risk_profile: user.risk_profile || 'moderate'
  });

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [profileErrors, setProfileErrors] = useState<FormErrors>({});
  const [passwordErrors, setPasswordErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const validatePhone = (phone: string): string | null => {
    if (!phone.trim()) return null; // Opcional para perfil
    
    // Remover espacios para validación
    const cleanPhone = phone.replace(/\s+/g, '');
    
    // Validar formato: +código_país(1-3 dígitos) + 10 dígitos
    const phoneRegex = /^\+\d{1,3}\d{10}$/;
    
    if (!phoneRegex.test(cleanPhone)) {
      return 'El número debe tener el formato: código de país (+1 a +999) seguido de 10 dígitos (ej: +573001234567, +12025551234)';
    }
    
    return null;
  };

  const validateProfileForm = (): boolean => {
    const errors: FormErrors = {};

    if (!profileData.first_name.trim()) {
      errors.first_name = 'El nombre es requerido';
    }

    if (!profileData.last_name.trim()) {
      errors.last_name = 'El apellido es requerido';
    }

    if (!profileData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      errors.email = 'Ingrese un email válido';
    }

    if (!profileData.username.trim()) {
      errors.username = 'El usuario es requerido';
    } else if (profileData.username.length < 3) {
      errors.username = 'El usuario debe tener al menos 3 caracteres';
    }

    // Usar la nueva validación de teléfono
    const phoneError = validatePhone(profileData.phone_number);
    if (phoneError) {
      errors.phone_number = phoneError;
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = (): boolean => {
    const errors: FormErrors = {};

    if (!passwordData.current_password) {
      errors.current_password = 'La contraseña actual es requerida';
    }

    if (!passwordData.new_password) {
      errors.new_password = 'La nueva contraseña es requerida';
    } else if (passwordData.new_password.length < 8) {
      errors.new_password = 'La nueva contraseña debe tener al menos 8 caracteres';
    }

    if (!passwordData.confirm_password) {
      errors.confirm_password = 'Confirme la nueva contraseña';
    } else if (passwordData.new_password !== passwordData.confirm_password) {
      errors.confirm_password = 'Las contraseñas no coinciden';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }

    try {
      if (onUpdateProfile) {
        // Limpiar el teléfono de espacios antes de enviar
        const cleanedProfileData = {
          ...profileData,
          phone_number: profileData.phone_number ? profileData.phone_number.replace(/\s+/g, '') : ''
        };
        
        const success = await onUpdateProfile(cleanedProfileData);
        if (success) {
          setSuccessMessage('Perfil actualizado correctamente');
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    try {
      if (onChangePassword) {
        const success = await onChangePassword(passwordData.current_password, passwordData.new_password);
        if (success) {
          setPasswordData({
            current_password: '',
            new_password: '',
            confirm_password: ''
          });
          setSuccessMessage('Contraseña actualizada correctamente');
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const handleProfileChange = (field: keyof ProfileFormData, value: string | RiskProfile) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (profileErrors[field]) {
      setProfileErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePasswordChange = (field: keyof PasswordFormData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="main-content">
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Título de la página */}
        <div className="mb-4">
          <h1>Perfil de Usuario</h1>
          <p style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--color-gray-medium)'
          }}>
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div style={{
            backgroundColor: '#E8F5E8',
            color: 'var(--color-success)',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '24px',
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-semibold)',
            border: '1px solid var(--color-success)'
          }}>
            {successMessage}
          </div>
        )}

        {/* Tabs de navegación */}
        <div style={{
          display: 'flex',
          borderBottom: '2px solid var(--color-gray-light)',
          marginBottom: '32px'
        }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: '12px 24px',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-semibold)',
              color: activeTab === 'profile' ? 'var(--color-primary)' : 'var(--color-gray-medium)',
              borderBottom: activeTab === 'profile' ? '2px solid var(--color-primary)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            INFORMACIÓN PERSONAL
          </button>
          <button
            onClick={() => setActiveTab('password')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: '12px 24px',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-semibold)',
              color: activeTab === 'password' ? 'var(--color-primary)' : 'var(--color-gray-medium)',
              borderBottom: activeTab === 'password' ? '2px solid var(--color-primary)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            CAMBIAR CONTRASEÑA
          </button>
        </div>

        {/* Contenido de los tabs */}
        <div style={{
          backgroundColor: 'var(--color-white)',
          padding: '32px',
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          border: '1px solid var(--color-gray-light)'
        }}>
          {activeTab === 'profile' ? (
            /* Tab de información personal */
            <form onSubmit={handleProfileSubmit}>
              <h2 style={{ marginBottom: '24px' }}>Información Personal</h2>

              {/* Nombre y Apellido */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label htmlFor="first_name" className="form-label">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    value={profileData.first_name}
                    onChange={(e) => handleProfileChange('first_name', e.target.value)}
                    className="form-input"
                    disabled={isLoading}
                    style={{
                      borderColor: profileErrors.first_name ? 'var(--color-error)' : undefined
                    }}
                  />
                  {profileErrors.first_name && (
                    <p className="status-error" style={{ fontSize: 'var(--font-size-small)', marginTop: '8px' }}>
                      {profileErrors.first_name}
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
                    value={profileData.last_name}
                    onChange={(e) => handleProfileChange('last_name', e.target.value)}
                    className="form-input"
                    disabled={isLoading}
                    style={{
                      borderColor: profileErrors.last_name ? 'var(--color-error)' : undefined
                    }}
                  />
                  {profileErrors.last_name && (
                    <p className="status-error" style={{ fontSize: 'var(--font-size-small)', marginTop: '8px' }}>
                      {profileErrors.last_name}
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
                  value={profileData.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="form-input"
                  disabled={isLoading}
                  style={{
                    borderColor: profileErrors.email ? 'var(--color-error)' : undefined
                  }}
                />
                {profileErrors.email && (
                  <p className="status-error" style={{ fontSize: 'var(--font-size-small)', marginTop: '8px' }}>
                    {profileErrors.email}
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
                  value={profileData.username}
                  onChange={(e) => handleProfileChange('username', e.target.value)}
                  className="form-input"
                  disabled={isLoading}
                  style={{
                    borderColor: profileErrors.username ? 'var(--color-error)' : undefined
                  }}
                />
                {profileErrors.username && (
                  <p className="status-error" style={{ fontSize: 'var(--font-size-small)', marginTop: '8px' }}>
                    {profileErrors.username}
                  </p>
                )}
              </div>

              {/* Teléfono y Fecha de Nacimiento */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label htmlFor="phone_number" className="form-label">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    value={profileData.phone_number}
                    onChange={(e) => handleProfileChange('phone_number', e.target.value)}
                    className="form-input"
                    placeholder="+573001234567 (código país + 10 dígitos)"
                    disabled={isLoading}
                    style={{
                      borderColor: profileErrors.phone_number ? 'var(--color-error)' : undefined
                    }}
                  />
                  {profileErrors.phone_number && (
                    <p className="status-error" style={{ fontSize: 'var(--font-size-small)', marginTop: '8px' }}>
                      {profileErrors.phone_number}
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
                    value={profileData.date_of_birth}
                    onChange={(e) => handleProfileChange('date_of_birth', e.target.value)}
                    className="form-input"
                    max={new Date().toISOString().split('T')[0]}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Perfil de Riesgo */}
              <div className="mb-4">
                <label htmlFor="risk_profile" className="form-label">
                  Perfil de Riesgo *
                </label>
                <select
                  id="risk_profile"
                  value={profileData.risk_profile}
                  onChange={(e) => handleProfileChange('risk_profile', e.target.value as RiskProfile)}
                  className="form-input"
                  disabled={isLoading}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="conservative">Conservador - Bajo riesgo, retornos estables</option>
                  <option value="moderate">Moderado - Balance entre riesgo y retorno</option>
                  <option value="aggressive">Agresivo - Alto riesgo, potencial alto retorno</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'ACTUALIZANDO...' : 'ACTUALIZAR PERFIL'}
              </button>
            </form>
          ) : (
            /* Tab de cambio de contraseña */
            <form onSubmit={handlePasswordSubmit}>
              <h2 style={{ marginBottom: '24px' }}>Cambiar Contraseña</h2>

              {/* Contraseña actual */}
              <div className="mb-3">
                <label htmlFor="current_password" className="form-label">
                  Contraseña Actual *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    id="current_password"
                    value={passwordData.current_password}
                    onChange={(e) => handlePasswordChange('current_password', e.target.value)}
                    className="form-input"
                    placeholder="Ingrese su contraseña actual"
                    disabled={isLoading}
                    style={{
                      borderColor: passwordErrors.current_password ? 'var(--color-error)' : undefined,
                      paddingRight: '48px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
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
                    {showPasswords.current ? 'OCULTAR' : 'MOSTRAR'}
                  </button>
                </div>
                {passwordErrors.current_password && (
                  <p className="status-error" style={{ fontSize: 'var(--font-size-small)', marginTop: '8px' }}>
                    {passwordErrors.current_password}
                  </p>
                )}
              </div>

              {/* Nueva contraseña */}
              <div className="mb-3">
                <label htmlFor="new_password" className="form-label">
                  Nueva Contraseña *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    id="new_password"
                    value={passwordData.new_password}
                    onChange={(e) => handlePasswordChange('new_password', e.target.value)}
                    className="form-input"
                    placeholder="Ingrese su nueva contraseña"
                    disabled={isLoading}
                    style={{
                      borderColor: passwordErrors.new_password ? 'var(--color-error)' : undefined,
                      paddingRight: '48px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
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
                    {showPasswords.new ? 'OCULTAR' : 'MOSTRAR'}
                  </button>
                </div>
                {passwordErrors.new_password && (
                  <p className="status-error" style={{ fontSize: 'var(--font-size-small)', marginTop: '8px' }}>
                    {passwordErrors.new_password}
                  </p>
                )}
              </div>

              {/* Confirmar nueva contraseña */}
              <div className="mb-4">
                <label htmlFor="confirm_password" className="form-label">
                  Confirmar Nueva Contraseña *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    id="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={(e) => handlePasswordChange('confirm_password', e.target.value)}
                    className="form-input"
                    placeholder="Confirme su nueva contraseña"
                    disabled={isLoading}
                    style={{
                      borderColor: passwordErrors.confirm_password ? 'var(--color-error)' : undefined,
                      paddingRight: '48px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
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
                    {showPasswords.confirm ? 'OCULTAR' : 'MOSTRAR'}
                  </button>
                </div>
                {passwordErrors.confirm_password && (
                  <p className="status-error" style={{ fontSize: 'var(--font-size-small)', marginTop: '8px' }}>
                    {passwordErrors.confirm_password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'CAMBIANDO CONTRASEÑA...' : 'CAMBIAR CONTRASEÑA'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;