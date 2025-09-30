import React from 'react';
import '../../styles/official-design.css';

// Importa la imagen del logo
import starkAdvisorLogo from '../../assets/stark-advisor-logo.png.jpg';

interface User {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
}

interface HeaderBannerProps {
  user?: User | null;
  onLogout?: () => void;
}

const HeaderBanner: React.FC<HeaderBannerProps> = ({
  user,
  onLogout
}) => {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '60px',
      backgroundColor: 'var(--color-primary)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <img 
          src={starkAdvisorLogo} 
          alt="StarkAdvisor Logo" 
          style={{
            height: '40px',
            width: 'auto'
          }}
        />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          <span style={{
            fontSize: '20px',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'white',
            lineHeight: '1'
          }}>
            STARKADVISOR
          </span>
          <span style={{
            fontSize: 'var(--font-size-small)',
            color: 'rgba(255,255,255,0.8)',
            lineHeight: '1'
          }}>
            PLATAFORMA DE INFORMACIÓN FINANCIERA
          </span>
        </div>
      </div>

      {/* Usuario */}
      {user && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          {/* Avatar */}
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'var(--color-white)',
            color: 'var(--color-primary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'var(--font-weight-semibold)',
            border: '2px solid var(--color-white)'
          }}>
            {user.first_name.charAt(0).toUpperCase()}{user.last_name.charAt(0).toUpperCase()}
          </div>
          
          <span style={{
            color: 'white',
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-semibold)'
          }}>
            {user.first_name} {user.last_name}
          </span>
          
          <button
            onClick={onLogout}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: 'var(--font-size-small)',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
            }}
          >
            Salir
          </button>
        </div>
      )}
    </header>
  );
};

export default HeaderBanner;