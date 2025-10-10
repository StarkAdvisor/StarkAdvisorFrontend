import React from 'react';
import HeaderBanner from './HeaderBanner';
import Sidebar from './Sidebar';
import Footer from './Footer';
import '../../styles/official-design.css';

interface LayoutProps {
  children: React.ReactNode;
  currentSection: string;
  onSectionChange: (section: string) => void;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
  };
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentSection, 
  onSectionChange, 
  user,
  onLogout 
}) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-white)' }}>
      {/* Header fijo arriba */}
      <HeaderBanner user={user} onLogout={onLogout} />
      
      {/* Sidebar fijo a la izquierda */}
      <Sidebar 
        currentSection={currentSection} 
        onSectionChange={onSectionChange}
      />
      
      {/* Contenido principal */}
      <main style={{
        marginLeft: '250px', // Ancho del sidebar
        marginTop: '60px',    // Altura del header
        minHeight: 'calc(100vh - 60px)',
        padding: '20px',
        backgroundColor: 'var(--color-gray-light)'
      }}>
        <div style={{
          backgroundColor: 'var(--color-white)',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          minHeight: 'calc(100vh - 160px)' // Espacio para footer
        }}>
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer style={{
        marginLeft: '250px', // Ancho del sidebar
        marginTop: '20px'
      }}>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;