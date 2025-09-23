import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import { User } from './types';
import './styles/official-design.css';

type ViewType = 'login' | 'register' | 'dashboard' | 'profile' | 'market' | 'news' | 'trade' | 'chatbot';

function App() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    login, 
    register, 
    logout, 
    updateUser,
    clearError 
  } = useAuth();
  
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const handleSwitchView = (view: ViewType) => {
    clearError();
    setCurrentView(view);
  };

  const handleNavigation = (section: string) => {
    if (section === 'logout') {
      logout();
      setCurrentView('login');
      return;
    }
    setCurrentView(section as ViewType);
  };

  const handleUpdateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const success = await updateUser(user.id, updates);
      return success;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // TODO: Implementar cambio de contraseña en el backend
    console.log('Cambio de contraseña:', { currentPassword, newPassword });
    return true;
  };

  const renderCurrentPage = () => {
    switch (currentView) {
      case 'profile':
        if (!user) return <div>No hay usuario logueado</div>;
        return (
          <UserProfile
            user={user}
            onUpdateProfile={handleUpdateProfile}
            onChangePassword={handleChangePassword}
            isLoading={isLoading}
          />
        );
      case 'market':
        return (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <h1>Mercado Financiero</h1>
            <p style={{ color: 'var(--color-gray-medium)', fontSize: 'var(--font-size-base)' }}>
              Módulo en desarrollo - Análisis de mercado y datos financieros en tiempo real
            </p>
          </div>
        );
      case 'news':
        return (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <h1>Noticias</h1>
            <p style={{ color: 'var(--color-gray-medium)', fontSize: 'var(--font-size-base)' }}>
              Módulo en desarrollo - Noticias financieras y análisis del mercado
            </p>
          </div>
        );
      case 'trade':
        return (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <h1>Trade del Día</h1>
            <p style={{ color: 'var(--color-gray-medium)', fontSize: 'var(--font-size-base)' }}>
              Módulo en desarrollo - Operaciones diarias y estrategias de trading
            </p>
          </div>
        );
      case 'chatbot':
        return (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <h1>ChatBot Financiero</h1>
            <p style={{ color: 'var(--color-gray-medium)', fontSize: 'var(--font-size-base)' }}>
              Módulo en desarrollo - Asistente virtual para consultas financieras
            </p>
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div>
            {/* Bienvenida */}
            <div style={{ marginBottom: '32px' }}>
              <h1>Panel de Control</h1>
              <p style={{
                fontSize: 'var(--font-size-base)',
                color: 'var(--color-gray-medium)'
              }}>
                Bienvenido a StarkAdvisor, {user?.first_name}
              </p>
            </div>

            {/* Información del usuario */}
            {user && (
              <div style={{
                backgroundColor: 'var(--color-white)',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                border: '1px solid var(--color-gray-light)',
                marginBottom: '32px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-white)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 'var(--font-weight-semibold)'
                  }}>
                    {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                  </div>
                  <div>
                    <h2 style={{ marginBottom: '4px' }}>
                      {user.first_name} {user.last_name}
                    </h2>
                    <p style={{
                      color: 'var(--color-gray-medium)',
                      fontSize: 'var(--font-size-base)',
                      marginBottom: '4px'
                    }}>
                      @{user.username} • {user.email}
                    </p>
                    <p style={{
                      color: 'var(--color-primary)',
                      fontSize: 'var(--font-size-base)',
                      fontWeight: 'var(--font-weight-semibold)'
                    }}>
                      Perfil: {getRiskProfileLabel(user.risk_profile)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Módulos disponibles */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              <div style={{
                backgroundColor: 'var(--color-white)',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                border: '1px solid var(--color-gray-light)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => handleNavigation('market')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
              }}>
                <h3 style={{
                  color: 'var(--color-primary)',
                  marginBottom: '8px'
                }}>
                  MERCADO FINANCIERO
                </h3>
                <p style={{
                  color: 'var(--color-gray-medium)',
                  fontSize: 'var(--font-size-base)'
                }}>
                  Datos en tiempo real del mercado bursátil y análisis de acciones
                </p>
              </div>

              <div style={{
                backgroundColor: 'var(--color-white)',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                border: '1px solid var(--color-gray-light)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => handleNavigation('news')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
              }}>
                <h3 style={{
                  color: 'var(--color-primary)',
                  marginBottom: '8px'
                }}>
                  NOTICIAS
                </h3>
                <p style={{
                  color: 'var(--color-gray-medium)',
                  fontSize: 'var(--font-size-base)'
                }}>
                  Noticias financieras y análisis del mercado en tiempo real
                </p>
              </div>

              <div style={{
                backgroundColor: 'var(--color-white)',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                border: '1px solid var(--color-gray-light)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => handleNavigation('trade')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
              }}>
                <h3 style={{
                  color: 'var(--color-primary)',
                  marginBottom: '8px'
                }}>
                  TRADE DEL DÍA
                </h3>
                <p style={{
                  color: 'var(--color-gray-medium)',
                  fontSize: 'var(--font-size-base)'
                }}>
                  Operaciones diarias y estrategias de trading en tiempo real
                </p>
              </div>

              <div style={{
                backgroundColor: 'var(--color-white)',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                border: '1px solid var(--color-gray-light)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => handleNavigation('chatbot')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
              }}>
                <h3 style={{
                  color: 'var(--color-primary)',
                  marginBottom: '8px'
                }}>
                  CHATBOT FINANCIERO
                </h3>
                <p style={{
                  color: 'var(--color-gray-medium)',
                  fontSize: 'var(--font-size-base)'
                }}>
                  Asistente virtual inteligente para consultas financieras
                </p>
              </div>

              <div style={{
                backgroundColor: 'var(--color-white)',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                border: '1px solid var(--color-gray-light)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => handleNavigation('profile')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
              }}>
                <h3 style={{
                  color: 'var(--color-primary)',
                  marginBottom: '8px'
                }}>
                  MI PERFIL
                </h3>
                <p style={{
                  color: 'var(--color-gray-medium)',
                  fontSize: 'var(--font-size-base)'
                }}>
                  Configuración de cuenta y preferencias personales
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  const getRiskProfileLabel = (profile: string) => {
    switch (profile) {
      case 'conservative': return 'Conservador';
      case 'moderate': return 'Moderado';
      case 'aggressive': return 'Agresivo';
      default: return profile;
    }
  };

  if (isLoading && !user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--color-white)'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid var(--color-gray-light)',
            borderTop: '4px solid var(--color-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--color-gray-medium)'
          }}>
            Cargando StarkAdvisor...
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <Layout
        currentSection={currentView}
        onSectionChange={handleNavigation}
        user={user}
        onLogout={() => handleNavigation('logout')}
      >
        {renderCurrentPage()}
      </Layout>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {currentView === 'login' ? (
        <LoginForm
          onLogin={login}
          isLoading={isLoading}
          error={error}
          onSwitchToRegister={() => handleSwitchView('register')}
        />
      ) : (
        <RegisterForm
          onRegister={register}
          isLoading={isLoading}
          error={error}
          onSwitchToLogin={() => handleSwitchView('login')}
        />
      )}
    </div>
  );
}

export default App;
