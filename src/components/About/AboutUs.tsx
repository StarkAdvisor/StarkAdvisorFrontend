import React from 'react';
import './AboutUs.css';
import starkAdvisorLogo from '../../assets/stark-advisor-logo.png.jpg';

const AboutUs: React.FC = () => {
  return (
    <div className="about-us">
      {/* Header con navegación */}
      <header className="about-header">
        <div className="header-content">
          <div className="logo-section">
            <img src={starkAdvisorLogo} alt="StarkAdvisor Logo" className="header-logo" />
            <div className="logo-text">
              <span className="brand-name">STARKADVISOR</span>
              <span className="brand-tagline">Plataforma de Información Financiera</span>
            </div>
          </div>
          
          <div className="header-navigation">
            <a href="/" className="nav-link">Inicio</a>
            <div className="auth-buttons">
              <a href="/login" className="btn-login">
                Iniciar Sesión
              </a>
              <a href="/register" className="btn-register">
                Registrarse
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1 className="about-title">Sobre Nosotros</h1>
          <p className="about-subtitle">
            Conoce más sobre StarkAdvisor y nuestro compromiso con el futuro financiero
          </p>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-card">
              <h2>Nuestra Misión</h2>
              <p>
                Democratizar el acceso a información financiera de calidad institucional, 
                proporcionando herramientas avanzadas de análisis y asesoría inteligente 
                que empoderen a cada usuario para tomar decisiones financieras informadas.
              </p>
            </div>
            <div className="mission-card">
              <h2>Nuestra Visión</h2>
              <p>
                Ser la plataforma financiera líder en América Latina, reconocida por 
                nuestra innovación tecnológica, precisión en el análisis de mercados 
                y compromiso con el éxito financiero de nuestros usuarios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Nuestros Valores</h2>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="var(--color-primary)" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="10" stroke="var(--color-primary)" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Transparencia</h3>
              <p>Información clara, datos verificables y procesos transparentes en cada interacción.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Innovación</h3>
              <p>Tecnología de vanguardia e inteligencia artificial para análisis financiero avanzado.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="var(--color-primary)" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Precisión</h3>
              <p>Análisis riguroso y datos exactos para decisiones financieras fundamentadas.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2"/>
                  <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2"/>
                  <path d="M22 11v6" stroke="white" strokeWidth="2"/>
                  <path d="M19 14h6" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Accesibilidad</h3>
              <p>Herramientas profesionales al alcance de todos, sin importar su nivel de experiencia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Nuestro Equipo</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo">
                <div className="photo-placeholder">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="var(--color-gray-medium)" strokeWidth="2"/>
                    <circle cx="12" cy="8" r="3" stroke="var(--color-gray-medium)" strokeWidth="2"/>
                    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="var(--color-gray-medium)" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
              <h3>Equipo de Desarrollo</h3>
              <p className="member-role">Estudiantes de Ingeniería de Sistemas e Informática</p>
              <p className="member-description">
                Juan Sebastian Granados, Juan Carlos Niño Osorio, Jorge Osorio, Leyder Steven Ortiz jaimes, Carlos Quintero
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tecnología */}
      <section className="tech-section">
        <div className="container">
          <h2 className="section-title">Nuestra Tecnología</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <h3>Inteligencia Artificial</h3>
              <p>Algoritmos avanzados para análisis de sentimiento de mercado y predicción de tendencias.</p>
            </div>
            <div className="tech-item">
              <h3>Datos en Tiempo Real</h3>
              <p>Conexiones directas con las principales bolsas y fuentes de información financiera mundial.</p>
            </div>
            <div className="tech-item">
              <h3>Seguridad</h3>
              <p>Encriptación de nivel bancario y protocolos de seguridad para proteger tu información.</p>
            </div>
            <div className="tech-item">
              <h3>Escalabilidad</h3>
              <p>Infraestructura en la nube diseñada para crecer con nuestros usuarios y sus necesidades.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <h2>¿Listo para comenzar tu journey financiero?</h2>
          <p>Únete a StarkAdvisor y descubre el futuro de las finanzas personales</p>
          <div className="cta-buttons">
            <a href="/register" className="btn-primary-large">Comenzar Ahora</a>
            <a href="/login" className="btn-secondary-large">Iniciar Sesión</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <img src={starkAdvisorLogo} alt="StarkAdvisor" />
              <span>StarkAdvisor</span>
            </div>
            <div className="footer-text">
              <p>&copy; 2025 StarkAdvisor. Todos los derechos reservados.</p>
              <p>Plataforma de información financiera de próxima generación.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;