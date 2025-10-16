import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { ApiService } from '../../services/api';
import './AssetDetail.css';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AssetData {
  ticker: string;
  name: string;
  price: number | null;
  daily_change: number | null;
  extra_metrics: Record<string, any>;
}

interface TimeSeriesData {
  date: string;
  price: number;
}

type TimePeriod = '1d' | '5d' | '1m' | '1y' | '5y';
type AssetType = 'stock' | 'etf' | 'currency';

const AssetDetail: React.FC = () => {
  const { type, ticker } = useParams<{ type: string; ticker: string }>();
  const navigate = useNavigate();
  
  // Log básico para verificar que el componente se carga
  console.log('🔍 AssetDetail component loaded with params:', { type, ticker });
  
  const [assetData, setAssetData] = useState<AssetData | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1y');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssetData = async () => {
    console.log('🚀 fetchAssetData called!');
    setLoading(true);
    setError(null);
    
    try {
      console.log('=== FETCHING ASSET DETAILS ===');
      console.log('Ticker:', ticker);
      console.log('Type:', type);
      
      let result;
      if (type === 'stock') {
        console.log('Calling getStockDetail for:', ticker);
        result = await ApiService.getStockDetail(ticker!);
      } else if (type === 'etf') {
        console.log('Calling getETFDetail for:', ticker);
        result = await ApiService.getETFDetail(ticker!);
      } else if (type === 'currency') {
        console.log('Calling getCurrencyDetail for:', ticker);
        result = await ApiService.getCurrencyDetail(ticker!);
      }
      
      console.log(`${(type || 'UNKNOWN').toUpperCase()} data loaded:`, result?.ticker, result?.name);
      console.log('=== NAME DEBUG ===');
      console.log('Ticker:', result?.ticker);
      console.log('Name:', result?.name);
      console.log('Are they equal?', result?.name === result?.ticker);
      console.log('Name is empty?', !result?.name || result?.name.trim() === '');
      console.log('Type:', type);
      console.log('=== END NAME DEBUG ===');
      console.log('Available metrics:', result?.extra_metrics ? Object.keys(result.extra_metrics) : 'None');
      setAssetData(result);
      
    } catch (error) {
      console.error('API call failed for asset details:', error);
      setAssetData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSeriesData = async () => {
    try {
      console.log('Connecting to real API for time series...');
      
      const assetTypeMapping = {
        'stock': 'stock',
        'etf': 'etf', 
        'currency': 'forex'
      };
      
      const apiAssetType = assetTypeMapping[type as keyof typeof assetTypeMapping] || 'stock';
      
      console.log('Fetching time series:', {
        ticker,
        period: selectedPeriod,
        asset_type: apiAssetType
      });
      
      const result = await ApiService.getTimeSeries({
        ticker: ticker!,
        period: selectedPeriod,
        asset_type: apiAssetType
      });
      
      console.log('Time series API Response:', result);
      console.log('Time series data points:', result?.length || 'No length property');
      
      let timeSeriesArray = result;
      if (result && !Array.isArray(result)) {
        timeSeriesArray = result.data || result.results || result.time_series || [];
        console.log('Found time series array in property:', timeSeriesArray);
      }
      
      const transformedData = (timeSeriesArray || []).map((item: any, index: number) => {
        if (index < 3) {
          console.log(`Transforming item ${index}:`, item);
        }
        
        let date, price;
        
        if (item.date && (item.price !== undefined)) {
          date = item.date;
          price = item.price;
        } else if (item.timestamp && (item.value !== undefined)) {
          date = item.timestamp;
          price = item.value;
        } else if (item.datetime && (item.close !== undefined)) {
          date = item.datetime;
          price = item.close;
        } else if (item.timestamp && (item.close_price !== undefined)) {
          date = item.timestamp;
          price = item.close_price;
        } else if (Array.isArray(item) && item.length >= 2) {
          date = new Date(item[0]).toISOString();
          price = item[1];
        } else {
          if (index < 3) {
            console.warn('Unknown time series item format:', item);
          }
          return null;
        }
        
        return {
          date: typeof date === 'string' ? date : new Date(date).toISOString(),
          price: parseFloat(price)
        };
      }).filter((item: any) => item !== null);
      
      console.log('Transformed time series data:', transformedData.slice(0, 3));
      console.log('Final data count:', transformedData.length);
      
      setTimeSeriesData(transformedData);
      
    } catch (error) {
      console.error('API call failed for time series:', error);
      setTimeSeriesData([]);
    }
  };

  useEffect(() => {
    if (ticker && type) {
      fetchAssetData();
    }
  }, [ticker, type]);

  useEffect(() => {
    if (assetData) {
      fetchTimeSeriesData();
    }
  }, [selectedPeriod, assetData]);

  const formatPrice = (price: number | null | undefined): string => {
    if (price === null || price === undefined) return 'N/A';
    if (type === 'currency') return price.toFixed(4);
    return `$${price.toFixed(2)}`;
  };

  const formatLargeNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return 'N/A';
    
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(1)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    } else {
      return value.toLocaleString();
    }
  };

  const formatVolume = (volume: number | null | undefined): string => {
    if (volume === null || volume === undefined) return 'N/A';
    
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(1)}B`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(1)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(1)}K`;
    } else {
      return volume.toLocaleString();
    }
  };

  const formatPercentage = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return 'N/A';
    return `${value.toFixed(2)}%`;
  };

  const formatRatio = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return 'N/A';
    return value.toFixed(2);
  };

  // Función para formatear el nombre del asset según el tipo
  const formatAssetName = (ticker: string | null, name: string | null, assetType: string | undefined): string => {
    console.log('formatAssetName called with:', { ticker, name, assetType });
    
    if (!name && !ticker) return 'Nombre no disponible';
    
    // Si name es igual al ticker, necesitamos generar un nombre más descriptivo
    const shouldFormat = name === ticker || !name || name.trim() === '';
    console.log('Should format name?', shouldFormat, 'Reason:', { 
      nameEqualsSymbol: name === ticker, 
      nameIsEmpty: !name,
      nameIsTrimEmpty: name ? name.trim() === '' : false
    });
    
    if (shouldFormat) {
      switch (assetType) {
        case 'stock':
          // Para acciones, generar nombre basado en el ticker
          const stockNames: { [key: string]: string } = {
            'A': 'Agilent Technologies Inc.',
            'AAPL': 'Apple Inc.',
            'ABBV': 'AbbVie Inc.',
            'ABNB': 'Airbnb Inc.',
            'ABT': 'Abbott Laboratories',
            'ACGL': 'Arch Capital Group Ltd.',
            'ACN': 'Accenture plc',
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
            'ADBE': 'Adobe Inc.',
            'PEP': 'PepsiCo Inc.',
            'TMO': 'Thermo Fisher Scientific Inc.'
          };
          const stockFormattedName = stockNames[ticker || ''] || `${ticker} Corporation`;
          console.log('Stock name formatted:', ticker, '->', stockFormattedName);
          return stockFormattedName;
          
        case 'etf':
          // Para ETFs, generar nombre basado en el ticker
          const etfNames: { [key: string]: string } = {
            'SPY': 'SPDR S&P 500 ETF Trust',
            'QQQ': 'Invesco QQQ Trust ETF',
            'VTI': 'Vanguard Total Stock Market ETF',
            'IWM': 'iShares Russell 2000 ETF'
          };
          return etfNames[ticker || ''] || `${ticker} ETF`;
          
        case 'currency':
          // Para divisas, generar nombre descriptivo
          const currencyNames: { [key: string]: string } = {
            'EURUSD=X': 'Euro / Dólar estadounidense',
            'GBPUSD=X': 'Libra esterlina / Dólar estadounidense',
            'USDJPY=X': 'Dólar estadounidense / Yen japonés',
            'EURJPY=X': 'Euro / Yen japonés',
            'EURGBP=X': 'Euro / Libra esterlina',
            'AUDUSD=X': 'Dólar australiano / Dólar estadounidense',
            'USDCAD=X': 'Dólar estadounidense / Dólar canadiense',
            'USDCHF=X': 'Dólar estadounidense / Franco suizo',
            'NZDUSD=X': 'Dólar neozelandés / Dólar estadounidense',
            'GBPJPY=X': 'Libra esterlina / Yen japonés'
          };
          const currencyFormattedName = currencyNames[ticker || ''] || 
                 (ticker || '').replace('=X', '').replace('USD', ' / USD').replace('EUR', 'EUR / ');
          console.log('Currency name formatted:', ticker, '->', currencyFormattedName);
          return currencyFormattedName;
          
        default:
          return name || ticker || 'Nombre no disponible';
      }
    }
    
    console.log('Returning original name:', name);
    return name;
  };

  // Función para renderizar métricas dinámicamente basado en lo que está disponible
  const renderAvailableMetrics = () => {
    if (!assetData?.extra_metrics) return null;

    const metrics = assetData.extra_metrics;
    const renderedMetrics: JSX.Element[] = [];

    // Mapeo de nombres de campos a etiquetas legibles
    const fieldLabels: { [key: string]: string } = {
      volume: 'VOLUMEN',
      market_cap: 'MARKET CAP',
      pe_ratio: 'P/E RATIO',
      dividend_yield: 'DIVIDEND YIELD',
      eps: 'EPS',
      beta: 'BETA',
      nav: 'NAV',
      expense_ratio: 'EXPENSE RATIO',
      bid: 'BID',
      ask: 'ASK',
      day_high: 'MÁXIMO DEL DÍA',
      day_low: 'MÍNIMO DEL DÍA',
      fifty_two_week_high: 'MÁXIMO 52 SEMANAS',
      fifty_two_week_low: 'MÍNIMO 52 SEMANAS',
      previous_close: 'CIERRE ANTERIOR',
      open_price: 'PRECIO APERTURA',
      average_volume: 'VOLUMEN PROMEDIO',
      shares_outstanding: 'ACCIONES EN CIRCULACIÓN',
      float: 'FLOAT',
      trailing_pe: 'P/E TRAILING',
      forward_pe: 'P/E FORWARD',
      price_to_book: 'P/B RATIO',
      debt_to_equity: 'DEBT/EQUITY',
      roe: 'ROE',
      roa: 'ROA',
      profit_margin: 'MARGEN DE BENEFICIO'
    };

    // Renderizar cada métrica disponible
    Object.entries(metrics).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        const label = fieldLabels[key] || key.toUpperCase().replace(/_/g, ' ');
        let formattedValue: string;

        // Formatear según el tipo de métrica
        switch (key) {
          case 'volume':
          case 'average_volume':
            formattedValue = formatVolume(value as number);
            break;
          case 'market_cap':
          case 'shares_outstanding':
          case 'float':
            formattedValue = formatLargeNumber(value as number);
            break;
          case 'dividend_yield':
          case 'expense_ratio':
          case 'roe':
          case 'roa':
          case 'profit_margin':
            formattedValue = formatPercentage(value as number);
            break;
          case 'pe_ratio':
          case 'beta':
          case 'trailing_pe':
          case 'forward_pe':
          case 'price_to_book':
          case 'debt_to_equity':
            formattedValue = formatRatio(value as number);
            break;
          case 'bid':
          case 'ask':
          case 'day_high':
          case 'day_low':
            formattedValue = (type === 'currency') ? (value as number).toFixed(4) : formatPrice(value as number);
            break;
          case 'eps':
          case 'nav':
          case 'fifty_two_week_high':
          case 'fifty_two_week_low':
          case 'previous_close':
          case 'open_price':
            formattedValue = formatPrice(value as number);
            break;
          default:
            formattedValue = typeof value === 'number' ? value.toFixed(2) : String(value);
        }

        renderedMetrics.push(
          <div key={key} className="metric-card">
            <span className="metric-label">{label}</span>
            <span className="metric-value">{formattedValue}</span>
          </div>
        );
      }
    });

    return renderedMetrics;
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

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    switch (selectedPeriod) {
      case '1d':
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      case '5d':
        return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit' });
      case '1m':
        return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      case '1y':
        return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
      case '5y':
        return date.toLocaleDateString('es-ES', { year: 'numeric' });
      default:
        return date.toLocaleDateString('es-ES');
    }
  };

  console.log('Creating chart with timeSeriesData:', timeSeriesData.length, 'points');
  
  const chartData = {
    labels: timeSeriesData.map(item => formatDate(item.date)),
    datasets: [
      {
        label: `Precio ${assetData?.ticker || 'Asset'}`,
        data: timeSeriesData.map(item => item.price),
        borderColor: '#004080',
        backgroundColor: 'rgba(0, 64, 128, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#004080',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        tension: 0,
        fill: false,
      },
    ],
  };

  // Log para verificar que Chart.js recibe datos correctos
  if (timeSeriesData.length > 0) {
    console.log('Chart.js data summary:', {
      labelsCount: chartData.labels.length,
      dataPointsCount: chartData.datasets[0].data.length,
      firstLabel: chartData.labels[0],
      firstPrice: chartData.datasets[0].data[0],
      lastLabel: chartData.labels[chartData.labels.length - 1],
      lastPrice: chartData.datasets[0].data[chartData.datasets[0].data.length - 1],
      samplePrices: chartData.datasets[0].data.slice(0, 5)
    });
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          title: (context: any) => {
            const dataIndex = context[0].dataIndex;
            const fullDate = new Date(timeSeriesData[dataIndex].date);
            return fullDate.toLocaleDateString('es-ES', { 
              weekday: 'long',
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          },
          label: (context: any) => {
            const price = context.parsed.y;
            return `Precio: ${formatPrice(price)}`;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 8,
        },
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: (value: any) => formatPrice(value),
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="asset-detail-loading">
        <div className="spinner"></div>
        <p>Cargando detalles...</p>
      </div>
    );
  }

  if (error || !assetData) {
    return (
      <div className="asset-detail-error">
        <h2>Error al cargar los datos</h2>
        <p>{error || 'No se pudieron obtener los detalles del activo'}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          Volver
        </button>
      </div>
    );
  }

  const changeData = formatChange(assetData?.daily_change || null);



  return (
    <div className="asset-detail">
      {/* Header */}
      <div className="asset-detail-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Volver
        </button>
        <div className="asset-info">
          <h1 className="asset-ticker">{assetData?.ticker || 'N/A'}</h1>
          <h2 className="asset-name">
            {formatAssetName(assetData?.ticker || null, assetData?.name || null, type)}
          </h2>
          <div className="asset-price-info">
            <span className="asset-price">{formatPrice(assetData?.price)}</span>
            <span className={`asset-change ${changeData.className}`}>
              {changeData.value}
            </span>
          </div>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="time-period-selector">
        {(['1d', '5d', '1m', '1y', '5y'] as TimePeriod[]).map(period => (
          <button
            key={period}
            className={`period-button ${selectedPeriod === period ? 'active' : ''}`}
            onClick={() => setSelectedPeriod(period)}
          >
            {period === '1d' ? '1 Día' : 
             period === '5d' ? '5 Días' :
             period === '1m' ? '1 Mes' :
             period === '1y' ? '1 Año' : '5 Años'}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="chart-container">
        {timeSeriesData.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="chart-loading">
            <p>Cargando datos de la gráfica...</p>
            <div className="spinner"></div>
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="asset-metrics">
        <h3>Métricas - {(type || 'Asset').toUpperCase()}</h3>
        <div className="metrics-grid">
          {renderAvailableMetrics()}
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;