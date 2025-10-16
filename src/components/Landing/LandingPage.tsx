import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import starkAdvisorLogo from '../../assets/stark-advisor-logo.png.jpg';
import imagenPresentacion from '../../assets/ImagenPresentacion.jpg';
import { useAuth } from '../../hooks/useAuth';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

type Sentiment = {
  label: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  score: number;
};

type NewsItem = {
  _id: string;
  title: string;
  url: string;
  source: string;
  date: string;
  category: string;
  description: string;
  sentiment?: Sentiment;
};

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(63847.25);
  const [priceChange, setPriceChange] = useState(2.34);
  const [marketData, setMarketData] = useState({
    volume: 28.4,
    marketCap: 1.2,
    dominance: 54.2
  });
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulador de precios en tiempo real
  useEffect(() => {
    const priceInterval = setInterval(() => {
      const change = (Math.random() - 0.5) * 200;
      setCurrentPrice(prev => Math.max(50000, prev + change));
      setPriceChange((Math.random() - 0.5) * 8);
      
      setMarketData(prev => ({
        volume: Math.max(20, prev.volume + (Math.random() - 0.5) * 2),
        marketCap: Math.max(1.0, prev.marketCap + (Math.random() - 0.5) * 0.1),
        dominance: Math.max(50, Math.min(60, prev.dominance + (Math.random() - 0.5) * 2))
      }));
    }, 3000);

    return () => clearInterval(priceInterval);
  }, []);

  // Fetch noticias desde el backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setNewsLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/news/?q=crypto&max_articles=6`
        );
        if (!response.ok) {
          throw new Error('Error al cargar noticias');
        }
        const data = await response.json();
        setNews(data.slice(0, 6)); // 6 noticias para el landing
      } catch (error) {
        console.error('Error fetching news:', error);
        // Si falla, mostrar noticias de fallback (las que ya tenías)
        setNews([
          {
            _id: 'fallback-1',
            title: 'Bitcoin reaches new weekly high following institutional adoption',
            description: 'Major institutions continue increasing their Bitcoin positions, driving the price to new levels of technical resistance.',
            url: '#',
            source: 'StarkAdvisor Demo',
            date: '2025-10-02',
            category: 'crypto',
            sentiment: { label: 'POSITIVE', score: 0.8 }
          },
          {
            _id: 'fallback-2',
            title: 'Fed maintains rates: Immediate impact on cryptocurrency markets',
            description: 'The Federal Reserve decision to maintain interest rates generates volatility in traditional and crypto markets.',
            url: '#',
            source: 'StarkAdvisor Demo',
            date: '2025-10-02',
            category: 'economy',
            sentiment: { label: 'NEGATIVE', score: 0.5 }
          },
          {
            _id: 'fallback-3',
            title: 'Ethereum 2.0: Update improves energy efficiency by 40%',
            description: 'The new Ethereum network update significantly reduces energy consumption, attracting more ESG investment.',
            url: '#',
            source: 'Bloomberg',
            date: '2025-10-02',
            category: 'crypto',
            sentiment: { label: 'POSITIVE', score: 0.99 }
          },
          {
            _id: 'fallback-4',
            title: 'UBS slashes euro zone corporate earnings outlook for 2025',
            description: 'UBS Global Wealth Management has forecast a 3% contraction in euro zone corporate earnings growth this year, as weak second-quarter results and...',
            url: '#',
            source: 'Reuters',
            date: new Date().toISOString(),
            category: 'finance',
            sentiment: { label: 'NEGATIVE', score: 0.2 }
          },
          {
            _id: 'fallback-5',
            title: "Fed's Powell says monetary policy framework back on more traditional footing",
            description: 'Federal Reserve Chair Jerome Powell on Friday announced an updated operating framework more oriented toward traditional efforts of promoting price stability.',
            url: '#',
            source: 'Reuters',
            date: new Date().toISOString(),
            category: 'economy',
            sentiment: { label: 'POSITIVE', score: 0.85 }
          },
          {
            _id: 'fallback-6',
            title: 'Apple Explores Using Google Gemini AI to Power Revamped Siri',
            description: 'Apple Inc. is in early discussions about using Google Gemini to power a revamped version of the Siri voice assistant, marking a key potential step toward...',
            url: '#',
            source: 'Bloomberg.com',
            date: new Date().toISOString(),
            category: 'tech',
            sentiment: { label: 'POSITIVE', score: 0.92 }
          }
        ]);
      } finally {
        setNewsLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Función para manejar el clic en "Ver Más Noticias"
  const handleViewMoreNews = () => {
    if (isAuthenticated) {
      // Si está autenticado, ir a la sección de noticias
      navigate('/app/news');
    } else {
      // Si no está autenticado, ir a login
      onLogin();
    }
  };

  // Componente de gráfico avanzado
  const AdvancedChart = () => {
    const [animationStep, setAnimationStep] = useState(0);

    useEffect(() => {
      const stepInterval = setInterval(() => {
        setAnimationStep(prev => (prev + 1) % 100);
      }, 50);
      return () => clearInterval(stepInterval);
    }, []);

    return (
      <div className="advanced-chart-container">
        <div className="chart-header-advanced">
          <div className="price-ticker">
            <span className="ticker-symbol">BTC/USD</span>
            <span className="ticker-price">
              ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`ticker-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="chart-main-area">
          <svg className="financial-chart" viewBox="0 0 500 300" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="chartGradientAdvanced" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: 'var(--color-secondary)', stopOpacity: 0.6}} />
                <stop offset="50%" style={{stopColor: 'var(--color-secondary)', stopOpacity: 0.3}} />
                <stop offset="100%" style={{stopColor: 'var(--color-secondary)', stopOpacity: 0.1}} />
              </linearGradient>
              
              <linearGradient id="glowEffect" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: '#ffffff', stopOpacity: 0}} />
                <stop offset="50%" style={{stopColor: '#ffffff', stopOpacity: 0.8}} />
                <stop offset="100%" style={{stopColor: '#ffffff', stopOpacity: 0}} />
              </linearGradient>

              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Grid lines */}
            {[0, 1, 2, 3, 4, 5].map(i => (
              <g key={i}>
                <line 
                  x1="50" y1={50 + i * 40} 
                  x2="450" y2={50 + i * 40}
                  stroke="rgba(255,255,255,0.1)" 
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <text 
                  x="35" y={55 + i * 40} 
                  fill="rgba(255,255,255,0.6)" 
                  fontSize="10"
                >
                  {(70000 - i * 5000).toLocaleString()}
                </text>
              </g>
            ))}

            {/* Candlestick chart data */}
            {[...Array(20)].map((_, i) => {
              const x = 60 + i * 20;
              const baseY = 150 + Math.sin(i * 0.3 + animationStep * 0.1) * 30;
              const high = baseY - Math.random() * 20;
              const low = baseY + Math.random() * 20;
              const open = baseY - Math.random() * 10;
              const close = baseY + Math.random() * 10;
              const isGreen = close < open;
              
              return (
                <g key={i} className="candlestick" opacity={0.8 + i * 0.01}>
                  <line 
                    x1={x} y1={high} 
                    x2={x} y2={low}
                    stroke={isGreen ? 'var(--color-secondary)' : '#ff4757'} 
                    strokeWidth="1"
                  />
                  <rect 
                    x={x - 3} y={Math.min(open, close)} 
                    width="6" height={Math.abs(close - open)}
                    fill={isGreen ? 'var(--color-secondary)' : '#ff4757'}
                    opacity="0.8"
                  />
                </g>
              );
            })}

            {/* Trend line */}
            <path 
              d="M 60 180 Q 150 160 250 140 T 420 120" 
              stroke="var(--color-secondary)" 
              strokeWidth="3" 
              fill="none"
              filter="url(#glow)"
              className="trend-line"
            />

            {/* Area under curve */}
            <path 
              d="M 60 180 Q 150 160 250 140 T 420 120 L 420 250 L 60 250 Z" 
              fill="url(#chartGradientAdvanced)"
            />

            {/* Moving glow effect */}
            <rect 
              x={50 + (animationStep * 4) % 400} 
              y="50" 
              width="20" 
              height="200"
              fill="url(#glowEffect)"
              opacity="0.3"
            />

            {/* Data points */}
            {[60, 120, 180, 240, 300, 360, 420].map((x, i) => (
              <circle 
                key={i}
                cx={x} 
                cy={140 + Math.sin(i * 0.5 + animationStep * 0.05) * 20} 
                r="4" 
                fill="var(--color-secondary)"
                filter="url(#glow)"
                className="data-point-advanced"
                style={{ 
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0.7 + Math.sin(animationStep * 0.1 + i) * 0.3
                }}
              />
            ))}
          </svg>
        </div>

        {/* Market stats */}
        <div className="market-stats">
          <div className="stat-item-advanced">
            <span className="stat-label">Vol 24h</span>
            <span className="stat-value">${marketData.volume.toFixed(1)}B</span>
          </div>
          <div className="stat-item-advanced">
            <span className="stat-label">Market Cap</span>
            <span className="stat-value">${marketData.marketCap.toFixed(1)}T</span>
          </div>
          <div className="stat-item-advanced">
            <span className="stat-label">BTC Dominance</span>
            <span className="stat-value">{marketData.dominance.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    );
  };

  // Componente contador animado
  const AnimatedCounter = ({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasStarted) {
            setHasStarted(true);
            const startTime = Date.now();

            const updateCount = () => {
              const now = Date.now();
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              // Easing function for smooth animation
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              const currentCount = Math.floor(easeOutQuart * end);
              
              setCount(currentCount);

              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                setCount(end);
              }
            };

            requestAnimationFrame(updateCount);
          }
        },
        { threshold: 0.3 }
      );

      const element = document.getElementById(`counter-${end}`);
      if (element) observer.observe(element);

      return () => observer.disconnect();
    }, [end, duration, hasStarted]);

    return (
      <span id={`counter-${end}`}>
        {count.toLocaleString()}{suffix}
      </span>
    );
  };
  return (
    <div className="landing-page">
      {/* Partículas flotantes de fondo */}
      <div className="floating-particles">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      {/* Header */}
      <header className={`landing-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <div className="logo-section">
            <img src={starkAdvisorLogo} alt="StarkAdvisor Logo" className="header-logo" />
            <div className="logo-text">
              <span className="brand-name">STARKADVISOR</span>
              <span className="brand-tagline">Plataforma de Información Financiera</span>
            </div>
          </div>
          
          <div className="header-navigation">
            <a href="/sobre-nosotros" className="nav-link">Sobre Nosotros</a>
            <div className="auth-buttons">
              <button className="btn-login" onClick={onLogin}>
                Iniciar Sesión
              </button>
              <button className="btn-register" onClick={onRegister}>
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        {/* Imagen de fondo para toda la sección hero */}
        <div className="hero-background-image">
          <img 
            src={imagenPresentacion} 
            alt="StarkAdvisor Financial Background" 
            className="hero-bg-img"
          />
        </div>
        
        {/* Overlay para mejorar legibilidad */}
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          <div className="hero-text-center">
            <h1 className="hero-title">
              Donde el mundo hace <span className="highlight">finanzas</span>
            </h1>
            <p className="hero-description">
              StarkAdvisor te brinda las herramientas más avanzadas para análisis financiero, 
              noticias del mercado en tiempo real y asesoría inteligente para tus inversiones.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary-large" onClick={onRegister}>
                Comenzar Gratis
              </button>
              <button className="btn-secondary-large" onClick={onLogin}>
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trading Chart Section */}
      <section className="chart-showcase-section">
        <div className="container">
          <div className="chart-showcase-header">
            <h2 className="section-title">Análisis en Tiempo Real</h2>
            <p className="section-subtitle">
              Visualiza los mercados financieros con nuestras herramientas avanzadas de análisis técnico
            </p>
          </div>
          <div className="chart-showcase-content">
            <AdvancedChart />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Potencia tu estrategia financiera</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3v18h18" stroke="var(--color-primary)" strokeWidth="2"/>
                  <path d="m19 9-5 5-4-4-3 3" stroke="var(--color-secondary)" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Análisis Avanzado</h3>
              <p>Gráficos profesionales con indicadores técnicos y herramientas de análisis de mercado en tiempo real.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="var(--color-primary)" strokeWidth="2"/>
                  <path d="m2 17 10 5 10-5" stroke="var(--color-primary)" strokeWidth="2"/>
                  <path d="m2 12 10 5 10-5" stroke="var(--color-primary)" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Noticias del Mercado</h3>
              <p>Mantente informado con las últimas noticias financieras y análisis de sentimiento del mercado.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="var(--color-primary)" strokeWidth="2"/>
                  <path d="M8 9h8" stroke="var(--color-secondary)" strokeWidth="2"/>
                  <path d="M8 13h6" stroke="var(--color-secondary)" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Chatbot Inteligente</h3>
              <p>Asistente de IA financiero que responde tus preguntas y te ayuda a tomar mejores decisiones.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="var(--color-primary)" strokeWidth="2"/>
                  <circle cx="9" cy="7" r="4" stroke="var(--color-primary)" strokeWidth="2"/>
                  <path d="m22 2-5 10-5-5 10-5z" stroke="var(--color-secondary)" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Perfil de Riesgo</h3>
              <p>Personaliza tu experiencia según tu perfil de riesgo y objetivos de inversión específicos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trade News Section */}
      <section className="trade-news-section">
        <div className="container">
          <div className="news-header">
            <h2 className="section-title">Noticias Financieras</h2>
            <p className="section-subtitle">
              Mantente actualizado con las últimas noticias y movimientos del mercado
            </p>
          </div>
          
          <div className="news-feed-grid">
            {newsLoading ? (
              // Estado de carga
              [...Array(6)].map((_, index) => (
                <article key={`loading-${index}`} className="news-feed-card loading">
                  <h3 className="news-feed-title">Cargando noticias...</h3>
                  <p className="news-feed-description">Por favor espera mientras cargamos las últimas noticias financieras desde nuestro backend.</p>
                  <div className="news-feed-meta">
                    <span className="news-feed-pill neutral">CARGANDO</span>
                    <span className="news-feed-source">StarkAdvisor</span>
                  </div>
                  <div className="news-feed-sentiment">
                    <div className="news-feed-sentiment__track">
                      <div className="news-feed-sentiment__bar neutral" style={{width: '50%'}}></div>
                    </div>
                    <span className="news-feed-sentiment__score">50%</span>
                  </div>
                </article>
              ))
            ) : (
              // Noticias con el diseño exacto de la imagen
              news.map((item, index) => {
                const formatDate = (dateString: string) => {
                  const date = new Date(dateString);
                  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
                };

                const getSentimentClass = (sentiment?: Sentiment) => {
                  if (!sentiment) return 'neutral';
                  return sentiment.label === 'POSITIVE' ? 'positive' : 'negative';
                };

                const getSentimentLabel = (sentiment?: Sentiment) => {
                  if (!sentiment) return 'Neutral';
                  return sentiment.label === 'POSITIVE' ? 'Positiva' : 'Negativa';
                };

                const getSentimentWidth = (sentiment?: Sentiment) => {
                  if (!sentiment) return '50%';
                  return `${Math.max(0, Math.min(100, Math.round(sentiment.score * 100)))}%`;
                };

                const getSentimentPercent = (sentiment?: Sentiment) => {
                  if (!sentiment) return '50%';
                  return `${Math.round(sentiment.score * 100)}%`;
                };

                return (
                  <article key={item._id} className="news-card-exact">
                    <div className="news-card-header">
                      <span className={`sentiment-pill ${getSentimentClass(item.sentiment)}`}>
                        {getSentimentLabel(item.sentiment)}
                      </span>
                      <span className="news-source-date">
                        {item.source} • {formatDate(item.date)}
                      </span>
                      <button className="open-btn">
                        ABRIR
                      </button>
                    </div>
                    
                    <h3 className="news-title-exact">
                      {item.title}
                    </h3>
                    
                    <p className="news-description-exact">
                      {item.description || 'Las grandes instituciones continúan aumentando sus posiciones, impulsando el precio a nuevos niveles de resistencia técnica.'}
                    </p>

                    {/* Barra de sentimiento exacta como en la imagen */}
                    <div className="sentiment-bar-container">
                      <div className="sentiment-bar-track">
                        <div 
                          className={`sentiment-bar-fill ${getSentimentClass(item.sentiment)}`}
                          style={{ width: getSentimentWidth(item.sentiment) }}
                        />
                      </div>
                      <span className="sentiment-percentage">{getSentimentPercent(item.sentiment)}</span>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          <div className="news-footer">
            <button 
              className="view-more-news" 
              onClick={handleViewMoreNews}
              title={isAuthenticated ? "Ver todas las noticias" : "Iniciar sesión para ver más noticias"}
            >
              {isAuthenticated ? "Ver Más Noticias" : "Ver Más Noticias (Iniciar Sesión)"}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>¿Listo para transformar tu estrategia financiera?</h2>
            <p>Únete a miles de inversores que ya confían en StarkAdvisor para sus decisiones financieras.</p>
            <div className="cta-buttons">
              <button className="btn-primary-large" onClick={onRegister}>
                Comenzar Ahora - Gratis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
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

export default LandingPage;