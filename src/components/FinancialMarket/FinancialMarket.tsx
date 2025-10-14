import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api';
import './FinancialMarket.css';

interface MetricData {
  ticker: string;
  name: string;
  price: number | null;
  daily_change: number | null;
  extra_metrics: Record<string, any>;
}

// Removido ApiResponse ya que no se usa directamente

type AssetType = 'stock' | 'etf' | 'currency';
type SortField = 'ticker' | 'price' | 'daily_change';
type SortOrder = 'asc' | 'desc';

const FinancialMarket: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AssetType>('stock');
  const [data, setData] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('ticker');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Función para navegar a los detalles de un activo
  const handleAssetClick = (ticker: string) => {
    navigate(`/app/market/${activeTab}/${ticker}`);
  };

  // Datos de prueba/mock
  const getMockData = (type: AssetType): MetricData[] => {
    if (type === 'stock') {
      return [
        {
          ticker: 'AAPL',
          name: 'Apple Inc.',
          price: 175.43,
          daily_change: 2.15,
          extra_metrics: {
            volume: 45234567,
            market_cap: 2750000000000,
            pe_ratio: 28.5,
            sector: 'Technology'
          }
        },
        {
          ticker: 'MSFT',
          name: 'Microsoft Corporation',
          price: 342.56,
          daily_change: -0.85,
          extra_metrics: {
            volume: 23456789,
            market_cap: 2540000000000,
            pe_ratio: 32.1,
            sector: 'Technology'
          }
        },
        {
          ticker: 'GOOGL',
          name: 'Alphabet Inc.',
          price: 128.91,
          daily_change: 1.67,
          extra_metrics: {
            volume: 31245678,
            market_cap: 1620000000000,
            pe_ratio: 25.3,
            sector: 'Communication Services'
          }
        },
        {
          ticker: 'AMZN',
          name: 'Amazon.com Inc.',
          price: 141.28,
          daily_change: -1.23,
          extra_metrics: {
            volume: 28567890,
            market_cap: 1470000000000,
            pe_ratio: 45.2,
            sector: 'Consumer Discretionary'
          }
        },
        {
          ticker: 'TSLA',
          name: 'Tesla Inc.',
          price: 248.42,
          daily_change: 3.78,
          extra_metrics: {
            volume: 67890123,
            market_cap: 790000000000,
            pe_ratio: 62.1,
            sector: 'Consumer Discretionary'
          }
        },
        {
          ticker: 'NVDA',
          name: 'NVIDIA Corporation',
          price: 429.89,
          daily_change: -1.45,
          extra_metrics: {
            volume: 45123678,
            market_cap: 1060000000000,
            pe_ratio: 68.3,
            sector: 'Technology'
          }
        },
        {
          ticker: 'META',
          name: 'Meta Platforms Inc.',
          price: 331.26,
          daily_change: 2.34,
          extra_metrics: {
            volume: 32456789,
            market_cap: 840000000000,
            pe_ratio: 24.7,
            sector: 'Communication Services'
          }
        },
        {
          ticker: 'JPM',
          name: 'JPMorgan Chase & Co.',
          price: 158.73,
          daily_change: -0.67,
          extra_metrics: {
            volume: 18967234,
            market_cap: 463000000000,
            pe_ratio: 12.4,
            sector: 'Financial Services'
          }
        },
        {
          ticker: 'JNJ',
          name: 'Johnson & Johnson',
          price: 163.45,
          daily_change: 0.89,
          extra_metrics: {
            volume: 12456789,
            market_cap: 430000000000,
            pe_ratio: 15.6,
            sector: 'Healthcare'
          }
        },
        {
          ticker: 'V',
          name: 'Visa Inc.',
          price: 267.82,
          daily_change: 1.23,
          extra_metrics: {
            volume: 8234567,
            market_cap: 563000000000,
            pe_ratio: 31.2,
            sector: 'Financial Services'
          }
        },
        {
          ticker: 'WMT',
          name: 'Walmart Inc.',
          price: 71.34,
          daily_change: -0.45,
          extra_metrics: {
            volume: 15678901,
            market_cap: 578000000000,
            pe_ratio: 27.8,
            sector: 'Consumer Staples'
          }
        },
        {
          ticker: 'PG',
          name: 'Procter & Gamble Co.',
          price: 164.23,
          daily_change: 0.78,
          extra_metrics: {
            volume: 6789012,
            market_cap: 388000000000,
            pe_ratio: 25.1,
            sector: 'Consumer Staples'
          }
        },
        {
          ticker: 'UNH',
          name: 'UnitedHealth Group Inc.',
          price: 521.67,
          daily_change: 1.67,
          extra_metrics: {
            volume: 4567890,
            market_cap: 487000000000,
            pe_ratio: 22.9,
            sector: 'Healthcare'
          }
        },
        {
          ticker: 'HD',
          name: 'Home Depot Inc.',
          price: 342.78,
          daily_change: -0.23,
          extra_metrics: {
            volume: 7890123,
            market_cap: 354000000000,
            pe_ratio: 21.4,
            sector: 'Consumer Discretionary'
          }
        },
        {
          ticker: 'MA',
          name: 'Mastercard Inc.',
          price: 412.56,
          daily_change: 1.89,
          extra_metrics: {
            volume: 3456789,
            market_cap: 394000000000,
            pe_ratio: 33.7,
            sector: 'Financial Services'
          }
        },
        {
          ticker: 'BAC',
          name: 'Bank of America Corp.',
          price: 39.45,
          daily_change: -1.12,
          extra_metrics: {
            volume: 45678901,
            market_cap: 315000000000,
            pe_ratio: 13.2,
            sector: 'Financial Services'
          }
        }
      ];
    } else if (type === 'etf') {
      return [
        {
          ticker: 'SPY',
          name: 'SPDR S&P 500 ETF Trust',
          price: 428.76,
          daily_change: 0.45,
          extra_metrics: {
            volume: 45234567,
            dividend_yield: 1.32,
            nav: 428.45
          }
        },
        {
          ticker: 'QQQ',
          name: 'Invesco QQQ Trust',
          price: 379.23,
          daily_change: -0.67,
          extra_metrics: {
            volume: 32145678,
            dividend_yield: 0.58,
            nav: 378.89
          }
        },
        {
          ticker: 'VTI',
          name: 'Vanguard Total Stock Market ETF',
          price: 245.12,
          daily_change: 0.23,
          extra_metrics: {
            volume: 23456789,
            dividend_yield: 1.28,
            nav: 244.98
          }
        },
        {
          ticker: 'IWM',
          name: 'iShares Russell 2000 ETF',
          price: 198.45,
          daily_change: -0.34,
          extra_metrics: {
            volume: 15678901,
            dividend_yield: 1.45,
            nav: 198.23
          }
        },
        {
          ticker: 'EFA',
          name: 'iShares MSCI EAFE ETF',
          price: 72.89,
          daily_change: 0.67,
          extra_metrics: {
            volume: 12345678,
            dividend_yield: 2.34,
            nav: 72.78
          }
        },
        {
          ticker: 'VEA',
          name: 'Vanguard Developed Markets ETF',
          price: 49.23,
          daily_change: 0.45,
          extra_metrics: {
            volume: 8901234,
            dividend_yield: 2.89,
            nav: 49.15
          }
        },
        {
          ticker: 'BND',
          name: 'Vanguard Total Bond Market ETF',
          price: 79.56,
          daily_change: -0.12,
          extra_metrics: {
            volume: 5678901,
            dividend_yield: 4.12,
            nav: 79.48
          }
        },
        {
          ticker: 'GLD',
          name: 'SPDR Gold Shares ETF',
          price: 189.34,
          daily_change: 0.89,
          extra_metrics: {
            volume: 7890123,
            dividend_yield: 0.00,
            nav: 189.28
          }
        },
        {
          ticker: 'XLF',
          name: 'Financial Select Sector SPDR Fund',
          price: 36.78,
          daily_change: -0.56,
          extra_metrics: {
            volume: 18901234,
            dividend_yield: 1.67,
            nav: 36.72
          }
        },
        {
          ticker: 'XLK',
          name: 'Technology Select Sector SPDR Fund',
          price: 178.45,
          daily_change: 1.23,
          extra_metrics: {
            volume: 14567890,
            dividend_yield: 0.78,
            nav: 178.34
          }
        }
      ];
    } else if (type === 'currency') {
      return [
        {
          ticker: 'EURUSD',
          name: 'Euro / US Dollar',
          price: 1.0854,
          daily_change: 0.12,
          extra_metrics: {
            bid: 1.0853,
            ask: 1.0855,
            day_high: 1.0867,
            day_low: 1.0842
          }
        },
        {
          ticker: 'GBPUSD',
          name: 'British Pound / US Dollar',
          price: 1.2743,
          daily_change: -0.23,
          extra_metrics: {
            bid: 1.2742,
            ask: 1.2744,
            day_high: 1.2758,
            day_low: 1.2731
          }
        },
        {
          ticker: 'USDJPY',
          name: 'US Dollar / Japanese Yen',
          price: 149.23,
          daily_change: 0.34,
          extra_metrics: {
            bid: 149.21,
            ask: 149.25,
            day_high: 149.45,
            day_low: 148.97
          }
        },
        {
          ticker: 'USDCAD',
          name: 'US Dollar / Canadian Dollar',
          price: 1.3567,
          daily_change: -0.18,
          extra_metrics: {
            bid: 1.3565,
            ask: 1.3569,
            day_high: 1.3578,
            day_low: 1.3545
          }
        },
        {
          ticker: 'AUDUSD',
          name: 'Australian Dollar / US Dollar',
          price: 0.6734,
          daily_change: 0.45,
          extra_metrics: {
            bid: 0.6733,
            ask: 0.6735,
            day_high: 0.6748,
            day_low: 0.6721
          }
        },
        {
          ticker: 'NZDUSD',
          name: 'New Zealand Dollar / US Dollar',
          price: 0.6045,
          daily_change: 0.23,
          extra_metrics: {
            bid: 0.6044,
            ask: 0.6046,
            day_high: 0.6058,
            day_low: 0.6032
          }
        },
        {
          ticker: 'USDCHF',
          name: 'US Dollar / Swiss Franc',
          price: 0.9123,
          daily_change: -0.34,
          extra_metrics: {
            bid: 0.9122,
            ask: 0.9124,
            day_high: 0.9135,
            day_low: 0.9108
          }
        },
        {
          ticker: 'EURGBP',
          name: 'Euro / British Pound',
          price: 0.8512,
          daily_change: 0.12,
          extra_metrics: {
            bid: 0.8511,
            ask: 0.8513,
            day_high: 0.8523,
            day_low: 0.8498
          }
        },
        {
          ticker: 'EURJPY',
          name: 'Euro / Japanese Yen',
          price: 161.89,
          daily_change: 0.67,
          extra_metrics: {
            bid: 161.87,
            ask: 161.91,
            day_high: 162.15,
            day_low: 161.45
          }
        },
        {
          ticker: 'GBPJPY',
          name: 'British Pound / Japanese Yen',
          price: 190.23,
          daily_change: -0.89,
          extra_metrics: {
            bid: 190.21,
            ask: 190.25,
            day_high: 190.78,
            day_low: 189.89
          }
        }
      ];
    }
    return [];
  };

  // Función para obtener datos
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        sort_by: sortBy,
        order: sortOrder,
        ...(searchQuery && { query: searchQuery }),
      };

      if (activeTab === 'stock') {
        const result = await ApiService.getStockMetrics({
          ...params,
          page: currentPage,
          page_size: 25
        });
        setData(result.results || []);
        setTotalPages(result.total_pages || 1);
      } else if (activeTab === 'etf') {
        const result = await ApiService.getETFMetrics(params);
        setData(result || []);
        setTotalPages(1);
      } else if (activeTab === 'currency') {
        const result = await ApiService.getCurrencyMetrics(params);
        setData(result || []);
        setTotalPages(1);
      }
    } catch (error: any) {
      console.error('Error connecting to API, using mock data as fallback:', error);
      setError(`Error conectando con el backend: ${error?.message || 'Error desconocido'}`);
      
      // Si falla la conexión, usa datos de prueba como fallback
      const mockData = getMockData(activeTab);
      console.log('Using mock data as fallback:', mockData);
      
      // Filtrar por búsqueda si hay query
      let filteredData = mockData;
      if (searchQuery) {
        filteredData = mockData.filter(item => 
          item.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Ordenar datos
      filteredData.sort((a, b) => {
        let aValue = a[sortBy as keyof MetricData] as number | string;
        let bValue = b[sortBy as keyof MetricData] as number | string;
        
        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();
        
        if (sortOrder === 'desc') {
          return aValue > bValue ? -1 : 1;
        } else {
          return aValue < bValue ? -1 : 1;
        }
      });

      console.log('Setting filtered data:', filteredData);
      setData(filteredData);
      if (activeTab === 'stock') {
        setTotalPages(Math.ceil(filteredData.length / 25));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, sortBy, sortOrder]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Buscar con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== '' || searchQuery === '') {
        setCurrentPage(1);
        fetchData();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleTabChange = (tab: AssetType) => {
    setActiveTab(tab);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatPrice = (price: number | null, type: AssetType): string => {
    if (price === null) return 'N/A';
    
    if (type === 'currency') {
      return price.toFixed(4);
    }
    return `$${price.toFixed(2)}`;
  };

  // Función para formatear nombres de assets
  const formatAssetName = (ticker: string | null, name: string | null, assetType: AssetType): string => {
    if (!name && !ticker) return 'Nombre no disponible';
    
    const shouldFormat = name === ticker || !name || name.trim() === '';
    
    if (shouldFormat) {
      switch (assetType) {
        case 'stock':
          const stockNames: { [key: string]: string } = {
            'A': 'Agilent Technologies Inc.',
            'AAPL': 'Apple Inc.',
            'ABBV': 'AbbVie Inc.',
            'ABNB': 'Airbnb Inc.',
            'ABT': 'Abbott Laboratories',
            'ACGL': 'Arch Capital Group Ltd.',
            'ACN': 'Accenture plc',
            'ADBE': 'Adobe Inc.',
            'AMD': 'Advanced Micro Devices Inc.',
            'AMZN': 'Amazon.com Inc.',
            'GOOGL': 'Alphabet Inc. Class A',
            'GOOG': 'Alphabet Inc. Class C',
            'JPM': 'JPMorgan Chase & Co.',
            'META': 'Meta Platforms Inc.',
            'MSFT': 'Microsoft Corporation',
            'NVDA': 'NVIDIA Corporation',
            'TSLA': 'Tesla Inc.',
            'V': 'Visa Inc.',
            'WMT': 'Walmart Inc.',
            'XOM': 'Exxon Mobil Corporation',
            'JNJ': 'Johnson & Johnson',
            'PG': 'Procter & Gamble Co.',
            'UNH': 'UnitedHealth Group Inc.',
            'HD': 'Home Depot Inc.',
            'CVX': 'Chevron Corporation',
            'LLY': 'Eli Lilly and Company',
            'PFE': 'Pfizer Inc.',
            'KO': 'Coca-Cola Company',
            'PEP': 'PepsiCo Inc.',
            'TMO': 'Thermo Fisher Scientific Inc.'
          };
          return stockNames[ticker || ''] || `${ticker} Corporation`;
          
        case 'etf':
          const etfNames: { [key: string]: string } = {
            'SPY': 'SPDR S&P 500 ETF Trust',
            'QQQ': 'Invesco QQQ Trust ETF',
            'VTI': 'Vanguard Total Stock Market ETF',
            'IWM': 'iShares Russell 2000 ETF'
          };
          return etfNames[ticker || ''] || `${ticker} ETF`;
          
        case 'currency':
          const currencyNames: { [key: string]: string } = {
            'AUDUSD=X': 'Dólar australiano / Dólar estadounidense',
            'EURGBP=X': 'Euro / Libra esterlina',
            'EURJPY=X': 'Euro / Yen japonés',
            'EURUSD=X': 'Euro / Dólar estadounidense',
            'GBPJPY=X': 'Libra esterlina / Yen japonés',
            'GBPUSD=X': 'Libra esterlina / Dólar estadounidense',
            'NZDUSD=X': 'Dólar neozelandés / Dólar estadounidense',
            'USDCAD=X': 'Dólar estadounidense / Dólar canadiense',
            'USDCHF=X': 'Dólar estadounidense / Franco suizo',
            'USDJPY=X': 'Dólar estadounidense / Yen japonés'
          };
          return currencyNames[ticker || ''] || 
                 (ticker || '').replace('=X', '').replace('USD', ' / USD');
          
        default:
          return name || ticker || 'Nombre no disponible';
      }
    }
    
    return name;
  };

  const formatChange = (change: number | null): { value: string; className: string } => {
    if (change === null) return { value: 'N/A', className: '' };
    
    const sign = change >= 0 ? '+' : '';
    const className = change >= 0 ? 'positive-change' : 'negative-change';
    
    return {
      value: `${sign}${change.toFixed(2)}%`,
      className
    };
  };

  const getColumnHeaders = () => {
    const baseHeaders = [
      { key: 'ticker' as SortField, label: 'Ticker' },
      { key: 'price' as SortField, label: activeTab === 'currency' ? 'Tasa' : 'Precio' },
      { key: 'daily_change' as SortField, label: 'Cambio Diario %' }
    ];

    const extraHeaders = [];
    
    if (activeTab === 'stock') {
      extraHeaders.push(
        { key: 'volume', label: 'Volumen' },
        { key: 'market_cap', label: 'Cap. Mercado' },
        { key: 'pe_ratio', label: 'P/E' },
        { key: 'sector', label: 'Sector' }
      );
    } else if (activeTab === 'etf') {
      extraHeaders.push(
        { key: 'volume', label: 'Volumen' },
        { key: 'dividend_yield', label: 'Dividend Yield' },
        { key: 'nav', label: 'NAV' }
      );
    } else if (activeTab === 'currency') {
      extraHeaders.push(
        { key: 'bid', label: 'Bid' },
        { key: 'ask', label: 'Ask' },
        { key: 'day_high', label: 'Máximo del Día' },
        { key: 'day_low', label: 'Mínimo del Día' }
      );
    }

    return [...baseHeaders, ...extraHeaders];
  };

  const renderExtraMetrics = (item: MetricData) => {
    if (activeTab === 'stock') {
      return (
        <>
          <td>{item.extra_metrics.volume ? item.extra_metrics.volume.toLocaleString() : 'N/A'}</td>
          <td>{item.extra_metrics.market_cap ? `$${(item.extra_metrics.market_cap / 1e9).toFixed(1)}B` : 'N/A'}</td>
          <td>{item.extra_metrics.pe_ratio ? item.extra_metrics.pe_ratio.toFixed(2) : 'N/A'}</td>
          <td>{item.extra_metrics.sector || 'N/A'}</td>
        </>
      );
    } else if (activeTab === 'etf') {
      return (
        <>
          <td>{item.extra_metrics.volume ? item.extra_metrics.volume.toLocaleString() : 'N/A'}</td>
          <td>{item.extra_metrics.dividend_yield ? `${item.extra_metrics.dividend_yield.toFixed(2)}%` : 'No Aplica'}</td>
          <td>{item.extra_metrics.nav ? `$${item.extra_metrics.nav.toFixed(2)}` : 'N/A'}</td>
        </>
      );
    } else if (activeTab === 'currency') {
      return (
        <>
          <td>{item.extra_metrics.bid ? item.extra_metrics.bid.toFixed(4) : 'N/A'}</td>
          <td>{item.extra_metrics.ask ? item.extra_metrics.ask.toFixed(4) : 'N/A'}</td>
          <td>{item.extra_metrics.day_high ? item.extra_metrics.day_high.toFixed(4) : 'N/A'}</td>
          <td>{item.extra_metrics.day_low ? item.extra_metrics.day_low.toFixed(4) : 'N/A'}</td>
        </>
      );
    }
    return null;
  };

  const getSortIcon = (field: SortField) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="financial-market">
      <div className="market-header">
        <h1>Mercado Financiero</h1>
        
        {/* Pestañas de categorías */}
        <div className="asset-tabs">
          <button 
            className={`tab-button ${activeTab === 'stock' ? 'active' : ''}`}
            onClick={() => handleTabChange('stock')}
          >
            Acciones
          </button>
          <button 
            className={`tab-button ${activeTab === 'etf' ? 'active' : ''}`}
            onClick={() => handleTabChange('etf')}
          >
            ETFs
          </button>
          <button 
            className={`tab-button ${activeTab === 'currency' ? 'active' : ''}`}
            onClick={() => handleTabChange('currency')}
          >
            Divisas
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="search-bar">
          <input
            type="text"
            placeholder={`Buscar ${activeTab === 'stock' ? 'acciones' : activeTab === 'etf' ? 'ETFs' : 'divisas'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* Controles de ordenamiento */}
        <div className="sorting-controls">
          <div className="sort-group">
            <label htmlFor="sortBy">Ordenar por:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortField)}
              className="sort-select"
            >
              <option value="ticker">Ticker (Símbolo)</option>
              <option value="price">Precio</option>
              <option value="daily_change">Cambio Diario %</option>
            </select>
          </div>
          
          <div className="sort-group">
            <label htmlFor="sortOrder">Orden:</label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="sort-select"
            >
              <option value="asc">Ascendente ↑</option>
              <option value="desc">Descendente ↓</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="market-table-container">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando datos...</p>
          </div>
        ) : (
          <>
            <div className="table-scroll-wrapper">
              <table className="market-table">
                <thead>
                  <tr>
                    {getColumnHeaders().map(header => (
                      <th 
                        key={header.key} 
                        className={header.key in ['ticker', 'price', 'daily_change'] ? 'sortable' : ''}
                        onClick={header.key in ['ticker', 'price', 'daily_change'] ? () => handleSort(header.key as SortField) : undefined}
                      >
                        {header.label}
                        {header.key in ['ticker', 'price', 'daily_change'] && (
                          <span className="sort-icon">
                            {getSortIcon(header.key as SortField)}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={getColumnHeaders().length} className="no-data">
                        {error ? (
                          <div className="error-message">
                            <strong>Error de conexión:</strong><br />
                            {error}<br />
                            <small>Verifica que el backend esté corriendo en http://127.0.0.1:8000</small>
                          </div>
                        ) : (
                          'No se encontraron datos'
                        )}
                      </td>
                    </tr>
                  ) : (
                    data.map((item, index) => {
                      const changeData = formatChange(item.daily_change);
                      return (
                        <tr 
                          key={`${item.ticker}-${index}`} 
                          className="data-row clickable-row"
                          onClick={() => handleAssetClick(item.ticker)}
                        >
                          <td className="ticker-cell">
                            <div className="ticker-info">
                              <strong>{item.ticker}</strong>
                              <small>{formatAssetName(item.ticker, item.name, activeTab)}</small>
                            </div>
                          </td>
                          <td className="price-cell">
                            <strong>{formatPrice(item.price, activeTab)}</strong>
                          </td>
                          <td className={`change-cell ${changeData.className}`}>
                            <strong>{changeData.value}</strong>
                          </td>
                          {renderExtraMetrics(item)}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación (solo para acciones) */}
            {activeTab === 'stock' && totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="page-button"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                
                <div className="page-input-container">
                  <span>Página</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt((e.target as HTMLInputElement).value);
                      if (page >= 1 && page <= totalPages) {
                        setCurrentPage(page);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const page = parseInt((e.target as HTMLInputElement).value);
                        if (page >= 1 && page <= totalPages) {
                          setCurrentPage(page);
                        }
                      }
                    }}
                    className="page-input"
                  />
                  <span>de {totalPages}</span>
                </div>
                
                <button 
                  className="page-button"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FinancialMarket;