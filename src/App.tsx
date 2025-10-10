import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import TradeOfTheDay from './components/TradeOfTheDay/TradeOfTheDay';
import ChatbotPanel from './components/Chatbot/ChatbotPanel';
import NewsFeed from './components/News/NewsFeed'; // <—— Asegúrate que exista este componente
import LandingPage from './components/Landing/LandingPage';
import AboutUs from './components/About/AboutUs';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import FinancialMarket from './components/FinancialMarket/FinancialMarket';
import AssetDetail from './components/FinancialMarket/AssetDetail';

import { User, LoginCredentials, RegisterData } from './types';
import './styles/official-design.css';

// Usuario DEMO cuando no hay sesión real
const DEMO_USER: User = {
  id: 1,
  first_name: 'Usuario',
  last_name: 'Demo',
  username: 'demo',
  email: 'demo@example.com',
  risk_profile: 'moderate',
  date_joined: new Date().toISOString(),
};

/* Mapeo sección <-> ruta para que el Layout navegue por URL */
const sectionToPath: Record<string, string> = {
  dashboard: '/app/dashboard',
  news: '/app/news',
  trade: '/app/trade',
  chatbot: '/app/chatbot',
  profile: '/app/profile',
  market: '/app/market',
  logout: '/',
};

const pathToSection = (pathname: string): string => {
  if (pathname.includes('/news')) return 'news';
  if (pathname.includes('/trade')) return 'trade';
  if (pathname.includes('/chatbot')) return 'chatbot';
  if (pathname.includes('/profile')) return 'profile';
  if (pathname.includes('/market')) return 'market';
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

/* ========= Dashboard mejorado y más profesional ========= */
function Dashboard() {
  const navigate = useNavigate();

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '28px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 64, 128, 0.08)',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #004080 0%, #0066cc 100%)',
    color: '#fff',
    padding: '32px',
    borderRadius: '16px',
    marginBottom: '32px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  };



  const Card = ({ 
    title, 
    to, 
    desc, 
    icon, 
    color = '#004080' 
  }: { 
    title: string; 
    to: string; 
    desc: string; 
    icon: string;
    color?: string;
  }) => (
    <div
      style={{
        ...cardStyle,
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        borderLeft: `4px solid ${color}`,
      }}
      onClick={() => navigate(to)}
      onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
        e.currentTarget.style.boxShadow = `0 12px 32px rgba(0, 64, 128, 0.15)`;
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 64, 128, 0.08)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '28px', marginRight: '12px' }}>{icon}</span>
        <h3 style={{ color, margin: 0, fontSize: '18px', fontWeight: '700' }}>{title}</h3>
      </div>
      <p style={{ color: '#666', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>{desc}</p>
      <div style={{
        position: 'absolute',
        bottom: '0',
        right: '0',
        width: '60px',
        height: '60px',
        background: `${color}10`,
        borderRadius: '50% 0 0 0',
        opacity: 0.3,
      }} />
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header mejorado */}
      <div style={headerStyle}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '60px',
          height: '60px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
        }} />
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700' }}>
          Panel de Control
        </h1>
        <p style={{ margin: 0, fontSize: '18px', opacity: 0.9 }}>
          Bienvenido a StarkAdvisor - Tu plataforma de información financiera
        </p>
      </div>

      {/* Grid de servicios mejorado */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        <Card 
          title="NOTICIAS FINANCIERAS" 
          to="/app/news" 
          desc="Mantente actualizado con los últimos titulares del mercado, análisis de sentimiento y noticias que impactan las inversiones"
          icon="📰"
          color="#8b5cf6"
        />
        <Card 
          title="TRADE DEL DÍA" 
          to="/app/trade" 
          desc="Descubre las mejores oportunidades de trading del día con análisis técnico, métricas avanzadas y recomendaciones de expertos"
          icon="💹"
          color="#10b981"
        />
        <Card 
          title="CHATBOT FINANCIERO" 
          to="/app/chatbot" 
          desc="Consulta con nuestro asistente de IA especializado en finanzas para resolver dudas y obtener análisis personalizados"
          icon="🤖"
          color="#f59e0b"
        />
        <Card 
          title="MERCADO FINANCIERO" 
          to="/app/market" 
          desc="Explora acciones, ETFs y divisas con métricas en tiempo real, gráficos interactivos y datos fundamentales completos"
          icon="📊"
          color="#004080"
        />
        <Card 
          title="MI PERFIL" 
          to="/app/profile" 
          desc="Gestiona tu cuenta, personaliza tu experiencia y configura tus preferencias de inversión y alertas de mercado"
          icon="👤"
          color="#6366f1"
        />
      </div>

      {/* Footer con información adicional */}
      <div style={{
        marginTop: '48px',
        padding: '24px',
        background: '#f8f9fa',
        borderRadius: '12px',
        textAlign: 'center',
      }}>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          <strong>StarkAdvisor</strong> - Plataforma integral de información financiera • 
          Datos en tiempo real • Análisis avanzado • Soporte 24/7
        </p>
      </div>
    </div>
  );
}

function Market() {
  return <FinancialMarket />;
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

/* ========= Componente Auth para manejar login/register ========= */
interface AuthProps {
  initialMode?: 'login' | 'register';
}

function Auth({ initialMode = 'login' }: AuthProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Aquí iría la lógica real de login con tu backend
      // Por ahora simulamos un login exitoso
      console.log('Attempting login with:', credentials);
      
      // Simulamos un pequeño delay
      await new Promise((resolve: (value: unknown) => void) => setTimeout(resolve, 1000));
      
      // Redirigir al dashboard después del login exitoso
      navigate('/app/dashboard');
      return true;
    } catch (error) {
      setError('Error al iniciar sesión. Verifique sus credenciales.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      
      console.log('Attempting register with:', userData);
      
      await new Promise((resolve: (value: unknown) => void) => setTimeout(resolve, 1000));
      

      setAuthMode('login');
      return true;
    } catch (error) {
      setError('Error al crear la cuenta. Intente nuevamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  if (authMode === 'register') {
    return (
      <RegisterForm
        onRegister={handleRegister}
        isLoading={isLoading}
        error={error}
        onSwitchToLogin={() => {
          setAuthMode('login');
          setError(null);
        }}
      />
    );
  }

  return (
    <LoginForm
      onLogin={handleLogin}
      isLoading={isLoading}
      error={error}
      onSwitchToRegister={() => {
        setAuthMode('register');
        setError(null);
      }}
    />
  );
}

/* ========= App con rutas reales ========= */
export default function App() {
  const { user, updateUser } = useAuth();
  const effectiveUser: User = user ?? DEMO_USER;
  const navigate = useNavigate();
  const location = useLocation();

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
      {/* Página de presentación como landing */}
      <Route path="/" element={
        <LandingPage 
          onLogin={() => navigate('/login')}
          onRegister={() => navigate('/register')}
        />
      } />
      
      {/* Página Sobre Nosotros */}
      <Route path="/sobre-nosotros" element={<AboutUs />} />
      
      {/* Rutas de autenticación */}
      <Route path="/login" element={<Auth key="login" initialMode="login" />} />
      <Route path="/register" element={<Auth key="register" initialMode="register" />} />
      
      {/* Rutas de la aplicación protegidas */}
      <Route path="/app" element={<Shell user={effectiveUser} />}>
        {/* raíz de la app -> dashboard */}
        <Route index element={<Navigate to="/app/dashboard" replace />} />

        {/* Rutas del producto */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="news" element={<NewsFeed />} />
        <Route path="trade" element={<TradeOfTheDay />} />
        <Route path="chatbot" element={<ChatbotPanel />} />
        <Route path="market" element={<Market />} />
        <Route path="market/:type/:ticker" element={<AssetDetail />} />
        <Route path="profile" element={<ProfilePage user={effectiveUser} onUpdate={handleUpdateProfile} />} />
      </Route>
      
      {/* Redirecciones para compatibilidad */}
      <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/news" element={<Navigate to="/app/news" replace />} />
      <Route path="/trade" element={<Navigate to="/app/trade" replace />} />
      <Route path="/chatbot" element={<Navigate to="/app/chatbot" replace />} />
      <Route path="/market" element={<Navigate to="/app/market" replace />} />
      <Route path="/profile" element={<Navigate to="/app/profile" replace />} />

      {/* 404 -> landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}