import React from 'react';
import '../../styles/official-design.css';

interface FooterProps {
  version?: string;
}

const Footer: React.FC<FooterProps> = ({ 
  version = "1.0.0" 
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Información principal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px',
          marginBottom: '24px'
        }}>
          {/* Información de la empresa */}
          <div>
            <h3 style={{
              fontSize: 'var(--font-size-h3)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-black)',
              marginBottom: '12px'
            }}>
              STARKADVISOR
            </h3>
            <p style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-gray-medium)',
              lineHeight: '1.5',
              marginBottom: '8px'
            }}>
              Plataforma de Asesoría Financiera Inteligente
            </p>
            <p style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-gray-medium)',
              lineHeight: '1.5'
            }}>
              Decisiones financieras informadas con análisis de mercado en tiempo real
            </p>
          </div>

          {/* Información académica */}
          <div>
            <h3 style={{
              fontSize: 'var(--font-size-h3)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-black)',
              marginBottom: '12px'
            }}>
              PROYECTO ACADÉMICO
            </h3>
            <p style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-gray-medium)',
              lineHeight: '1.5',
              marginBottom: '8px'
            }}>
              Universidad Pontificia Bolivariana
            </p>
            <p style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-gray-medium)',
              lineHeight: '1.5',
              marginBottom: '8px'
            }}>
              Ingeniería de Sistemas - Sexto Semestre
            </p>
            <p style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-gray-medium)',
              lineHeight: '1.5'
            }}>
              Proyecto Integrador
            </p>
          </div>

          {/* Información técnica */}
          <div>
            <h3 style={{
              fontSize: 'var(--font-size-h3)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-black)',
              marginBottom: '12px'
            }}>
              INFORMACIÓN TÉCNICA
            </h3>
            <p style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-gray-medium)',
              lineHeight: '1.5',
              marginBottom: '8px'
            }}>
              Versión: {version}
            </p>
            <p style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-gray-medium)',
              lineHeight: '1.5',
              marginBottom: '8px'
            }}>
              Stack: React + Django + PostgreSQL
            </p>
            <p style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-gray-medium)',
              lineHeight: '1.5'
            }}>
              Datos financieros: Yahoo Finance API
            </p>
          </div>

        </div>

        {/* Línea divisoria */}
        <div style={{
          height: '1px',
          backgroundColor: 'var(--color-gray-light)',
          marginBottom: '16px'
        }}></div>

        {/* Copyright y enlaces */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{
            fontSize: 'var(--font-size-small)',
            color: 'var(--color-gray-medium)',
            margin: 0
          }}>
            © {currentYear} StarkAdvisor. Proyecto académico - Universidad Pontifica Bolivariana.
          </p>

          {/* Enlaces adicionales */}
          <div style={{
            display: 'flex',
            gap: '16px'
          }}>
            <span style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-gray-medium)',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}>
              Acerca de
            </span>
            <span style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-gray-medium)',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}>
              Documentación
            </span>
            <span style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-gray-medium)',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}>
              Contacto
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;