import React, { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface Activo {
  simbolo: string;
  nombre: string;
  precio: number;
  cambio: string;
}

interface HistoricalData {
  date: string;
  price: number;
}

const MercadoFinanciero: React.FC = () => {
  const [categoria, setCategoria] = useState<"acciones" | "etfs" | "divisas">("acciones");
  const [activos, setActivos] = useState<Activo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Estado para el activo seleccionado (click en tabla)
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loadingChart, setLoadingChart] = useState<boolean>(false);

  // Cargar lista de activos
  const fetchData = async (cat: "acciones" | "etfs" | "divisas") => {
    setLoading(true);
    setError("");
    try {
      const mockData: {
      acciones: Activo[];
      etfs: Activo[];
      divisas: Activo[];
      } = {
      acciones: [
        { simbolo: "AAPL", nombre: "Apple Inc.", precio: 175.35, cambio: "1.2" },
        { simbolo: "TSLA", nombre: "Tesla Inc.", precio: 250.14, cambio: "-2.1" },
        { simbolo: "MSFT", nombre: "Microsoft", precio: 330.1, cambio: "0.8" },
        { simbolo: "AMZN", nombre: "Amazon.com Inc.", precio: 135.76, cambio: "0.5" },
        { simbolo: "GOOGL", nombre: "Alphabet Inc.", precio: 138.42, cambio: "-0.3" },
      ],
      etfs: [
        { simbolo: "SPY", nombre: "SPDR S&P 500 ETF", precio: 450.12, cambio: "0.6" },
        { simbolo: "QQQ", nombre: "Invesco QQQ Trust", precio: 370.55, cambio: "-1.1" },
        { simbolo: "IVV", nombre: "iShares Core S&P 500", precio: 448.32, cambio: "0.9" },
        { simbolo: "ARKK", nombre: "ARK Innovation ETF", precio: 42.15, cambio: "-0.7" },
      ],
      divisas: [
        { simbolo: "EUR/USD", nombre: "Euro / Dólar", precio: 1.065, cambio: "-0.2" },
        { simbolo: "USD/JPY", nombre: "Dólar / Yen", precio: 148.75, cambio: "0.4" },
        { simbolo: "GBP/USD", nombre: "Libra / Dólar", precio: 1.235, cambio: "0.1" },
        { simbolo: "USD/CAD", nombre: "Dólar / Dólar Canadiense", precio: 1.355, cambio: "-0.3" },
        { simbolo: "AUD/USD", nombre: "Dólar Australiano / Dólar", precio: 0.658, cambio: "0.2" },
      ],
    };
    await new Promise((r) => setTimeout(r, 500)); // simular delay
    setActivos(mockData[cat]); // ✅ pasar solo el array de la categoría
  } catch (err) {
    setError("Error al cargar datos");
  } finally {
    setLoading(false);
  }
};

// Historicos simulados para cada sección y símbolo
const mockHistoricalData: Record<string, HistoricalData[]> = {
  AAPL: [
    { date: "2023-09-01", price: 170 },
    { date: "2023-09-02", price: 172 },
    { date: "2023-09-03", price: 175 },
    { date: "2023-09-04", price: 180 },
    { date: "2023-09-05", price: 178 },
  ],
  MSFT: [
    { date: "2023-09-01", price: 300 },
    { date: "2023-09-02", price: 310 },
    { date: "2023-09-03", price: 305 },
    { date: "2023-09-04", price: 315 },
    { date: "2023-09-05", price: 320 },
  ],
  SPY: [
    { date: "2023-09-01", price: 450 },
    { date: "2023-09-02", price: 452 },
    { date: "2023-09-03", price: 448 },
    { date: "2023-09-04", price: 455 },
    { date: "2023-09-05", price: 460 },
  ],
  EURUSD: [
    { date: "2023-09-01", price: 1.08 },
    { date: "2023-09-02", price: 1.10 },
    { date: "2023-09-03", price: 1.12 },
    { date: "2023-09-04", price: 1.11 },
    { date: "2023-09-05", price: 1.13 },
  ],
  BTC: [
    { date: "2023-09-01", price: 25000 },
    { date: "2023-09-02", price: 25500 },
    { date: "2023-09-03", price: 26000 },
    { date: "2023-09-04", price: 25800 },
    { date: "2023-09-05", price: 26500 },
  ],
  GOLD: [
    { date: "2023-09-01", price: 1900 },
    { date: "2023-09-02", price: 1920 },
    { date: "2023-09-03", price: 1915 },
    { date: "2023-09-04", price: 1930 },
    { date: "2023-09-05", price: 1940 },
  ],
  TSLA: [
    { date: "2023-09-01", price: 250 },
    { date: "2023-09-02", price: 255 },
    { date: "2023-09-03", price: 260 },
    { date: "2023-09-04", price: 258 },
    { date: "2023-09-05", price: 265 },
  ],
  AMZN: [
    { date: "2023-09-01", price: 135 },
    { date: "2023-09-02", price: 138 },
    { date: "2023-09-03", price: 137 },
    { date: "2023-09-04", price: 140 },
    { date: "2023-09-05", price: 142 },
  ],
  GOOGL: [
    { date: "2023-09-01", price: 125 },
    { date: "2023-09-02", price: 127 },
    { date: "2023-09-03", price: 126 },
    { date: "2023-09-04", price: 129 },
    { date: "2023-09-05", price: 131 },
  ],
  QQQ: [
    { date: "2023-09-01", price: 370 },
    { date: "2023-09-02", price: 375 },
    { date: "2023-09-03", price: 373 },
    { date: "2023-09-04", price: 378 },
    { date: "2023-09-05", price: 382 },
  ],
  IVV: [
    { date: "2023-09-01", price: 440 },
    { date: "2023-09-02", price: 443 },
    { date: "2023-09-03", price: 441 },
    { date: "2023-09-04", price: 446 },
    { date: "2023-09-05", price: 450 },
  ],
  ARKK: [
    { date: "2023-09-01", price: 40 },
    { date: "2023-09-02", price: 41 },
    { date: "2023-09-03", price: 39 },
    { date: "2023-09-04", price: 42 },
    { date: "2023-09-05", price: 43 },
  ],
};

// Función que carga histórico según el símbolo
const fetchHistoricalData = async (symbol: string) => {
  setLoadingChart(true);
  setError("");
  try {
    const history = mockHistoricalData[symbol] || [];
    await new Promise((r) => setTimeout(r, 1500)); // simula delay
    setHistoricalData(history);
  } catch (err) {
    setError("Error cargando histórico local");
  } finally {
    setLoadingChart(false);
  }
};


  // Cuando cambie categoría → recargar lista
  useEffect(() => {
    fetchData(categoria);
  }, [categoria]);

  // Cuando el usuario haga click en un símbolo
  useEffect(() => {
    if (selectedSymbol) {
      fetchHistoricalData(selectedSymbol);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [selectedSymbol]);

  return (
    <div className="financial-market">
      <h1>Mercado Financiero</h1>

      {/* Selector de categorías */}
      <div className="category-selector">
        <button
          onClick={() => setCategoria("acciones")}
          className={categoria === "acciones" ? "tab active" : "tab"}
        >
          Acciones
        </button>
        <button
          onClick={() => setCategoria("etfs")}
          className={categoria === "etfs" ? "tab active" : "tab"}
        >
          ETFs
        </button>
        <button
          onClick={() => setCategoria("divisas")}
          className={categoria === "divisas" ? "tab active" : "tab"}
        >
          Divisas
        </button>
      </div>

      {/* Tabla de activos */}
      <div className="table-container">
        <div className="table-wrapper">
          {loading && <p>Cargando datos...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Símbolo</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Cambio</th>
                </tr>
              </thead>
              <tbody>
                {activos.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => setSelectedSymbol(item.simbolo)}
                    className={selectedSymbol === item.simbolo ? "selected" : ""}
                  >
                    <td>{item.simbolo}</td>
                    <td>{item.nombre}</td>
                    <td>{item.precio}</td>
                    <td className={Number(item.cambio) < 0 ? "negativo" : "positivo"}>
                      {item.cambio}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Gráfico histórico */}
      {selectedSymbol && (
        <div className="chart-container">
          <h2>
            Evolución de {selectedSymbol}
          </h2>
          {loadingChart ? (
            <p>Cargando gráfico...</p>
          ) : historicalData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#004080"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No hay datos históricos</p>
          )}
        </div>
)}
    </div>
  );
};

export default MercadoFinanciero;



/*
  const MercadoFinanciero: React.FC = () => {
  const [activos, setActivos] = useState<Activo[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Cargar lista de activos al inicio
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchActivos();
        setActivos(data);
      } catch (error) {
        console.error("Error cargando activos:", error);
      }
    };
    loadData();
  }, []);

  // Cargar histórico cuando seleccionamos un símbolo
  const handleSelectSymbol = async (symbol: string) => {
    setLoading(true);
    setSelectedSymbol(symbol);
    try {
      const history = await fetchHistoricalData(symbol);
      setHistoricalData(history);
    } catch (error) {
      console.error("Error cargando histórico:", error);
    } finally {
      setLoading(false);
    }
  };
*/
