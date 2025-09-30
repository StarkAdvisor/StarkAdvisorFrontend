import React from 'react';
import '../../styles/official-design.css';

interface SidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection, onSectionChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'profile', label: 'Perfil', icon: '👤' },
    { id: 'market', label: 'Mercado financiero', icon: '📈' },
    { id: 'news', label: 'Noticias', icon: '📰' },
    { id: 'trade', label: 'Trade del día', icon: '💹' },
    { id: 'chatbot', label: 'Chat bot', icon: '🤖' }
  ];

  return (
    <aside style={{
      width: '250px',
      height: '100vh',
      backgroundColor: 'var(--color-gray-light)',
      borderRight: '1px solid var(--color-gray-medium)',
      position: 'fixed',
      left: 0,
      top: '60px', 
      zIndex: 100,
      overflowY: 'auto'
    }}>
      <nav style={{ padding: '20px 0' }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            style={{
              width: '100%',
              padding: '12px 20px',
              border: 'none',
              backgroundColor: currentSection === item.id ? 'var(--color-primary)' : 'transparent',
              color: currentSection === item.id ? 'white' : 'var(--color-black)',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-regular)',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (currentSection !== item.id) {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }
            }}
            onMouseLeave={(e) => {
              if (currentSection !== item.id) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;