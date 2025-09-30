import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import TradeOfTheDay from './components/TradeOfTheDay/TradeOfTheDay';
import ChatbotPanel from './components/Chatbot/ChatbotPanel';
import NewsFeed from './components/News/NewsFeed'; // <—— Asegúrate que exista este componente

import { User } from './types';
import './styles/official-design.css';

// Usuario DEMO cuando no hay sesión real
const DEMO_USER: User = {
  id: 'demo-1',
  first_name: 'Usuario',
  last_name: 'Demo',
  username: 'demo',
  email: 'demo@example.com',
  risk_profile: 'moderate',
};

/* Mapeo sección <-> ruta para que el Layout navegue por URL */
const sectionToPath: Record<string, string> = {
  dashboard: '/dashboard',
  news: '/news',
  trade: '/trade',
  chatbot: '/chatbot',
  profile: '/profile',
  market: '/market',
  logout: '/dashboard',
};

const pathToSection = (pathname: string): string => {
  if (pathname.startsWith('/news')) return 'news';
  if (pathname.startsWith('/trade')) return 'trade';
  if (pathname.startsWith('/chatbot')) return 'chatbot';
  if (pathname.startsWith('/profile')) return 'profile';
  if (pathname.startsWith('/market')) return 'market';
  return 'dashboard';
};

/* ========= Shell: envuelve las páginas con tu Layout ========= */
function Shell({ user }: { user: User }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentSection = pathToSection(location.pathname);

  const onSectionChange = (section: string) => {
    const path = sectionToPath[section] ?? '/dashboard';
    navigate(path);
  };

  return (
    <Layout
      currentSection={currentSection}
      onSectionChange={onSectionChange}
      user={user}
      onLogout={() => onSectionChange('logout')}
    >
      <Outlet />
    </Layout>
  );
}

/* ========= Páginas (las mismas vistas que tenías) ========= */
function Dashboard() {
  const navigate = useNavigate();

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const Card = ({ title, to, desc }: { title: string; to: string; desc: string }) => (
    <div
      style={cardStyle}
      onClick={() => navigate(to)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.1)';
      }}
    >
      <h3 style={{ color: '#004080', marginBottom: 8 }}>{title}</h3>
      <p style={{ color: '#666', fontSize: 16 }}>{desc}</p>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1>Panel de Control</h1>
        <p style={{ fontSize: 16, color: '#666' }}>
          Bienvenido a StarkAdvisor
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}
      >
        <Card title="NOTICIAS" to="/news" desc="Titulares, enlace y sentimiento" />
        <Card title="TRADE DEL DÍA" to="/trade" desc="Operaciones y métricas del día" />
        <Card title="CHATBOT FINANCIERO" to="/chatbot" desc="Asistente para tus consultas" />
        <Card title="MERCADO FINANCIERO" to="/market" desc="Módulo en desarrollo" />
        <Card title="MI PERFIL" to="/profile" desc="Configuración de cuenta" />
      </div>
    </div>
  );
}

function Market() {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <h1>Mercado Financiero</h1>
      <p style={{ color: '#666', fontSize: 16 }}>Módulo en desarrollo</p>
    </div>
  );
}

function ProfilePage({ user, onUpdate }: { user: User; onUpdate: (u: Partial<User>) => Promise<boolean> }) {
  return (
    <UserProfile
      user={user}
      onUpdateProfile={onUpdate}
      onChangePassword={async () => true}
      isLoading={false}
    />
  );
}

/* ========= App con rutas reales ========= */
export default function App() {
  const { user, updateUser } = useAuth();
  const effectiveUser: User = user ?? DEMO_USER;

  const handleUpdateProfile = async (updates: Partial<User>) => {
    if (!user) return true; // DEMO (sin backend)
    try {
      return await updateUser(user.id, updates);
    } catch {
      return false;
    }
  };

  return (
    <Routes>
      {/* Todo bajo "/" usa tu Layout */}
      <Route element={<Shell user={effectiveUser} />}>
        {/* raíz -> dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Rutas del producto */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/news" element={<NewsFeed />} />      {/* <<< Noticias por URL */}
        <Route path="/trade" element={<TradeOfTheDay />} />
        <Route path="/chatbot" element={<ChatbotPanel />} />
        <Route path="/market" element={<Market />} />
        <Route path="/profile" element={<ProfilePage user={effectiveUser} onUpdate={handleUpdateProfile} />} />

        {/* 404 -> dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}