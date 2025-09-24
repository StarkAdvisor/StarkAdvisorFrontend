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
      const mockData: Activo[] = [
        { simbolo: "AAPL", nombre: "Apple Inc.", precio: 175.35, cambio: "1.2" },
        { simbolo: "TSLA", nombre: "Tesla Inc.", precio: 250.14, cambio: "-2.1" },
        { simbolo: "MSFT", nombre: "Microsoft", precio: 330.1, cambio: "0.8" },
      ];
      await new Promise((r) => setTimeout(r, 500));
      setActivos(mockData);
    } catch (err) {
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  // Traer datos históricos desde el backend (aquí simulado)
  const fetchHistoricalData = async (symbol: string) => {
    setLoadingChart(true);
    setError("");
    try {
      const mockHistory: HistoricalData[] = [
        { date: "2023-09-01", price: 170 },
        { date: "2023-09-02", price: 172 },
        { date: "2023-09-03", price: 175 },
        { date: "2023-09-04", price: 180 },
        { date: "2023-09-05", price: 178 },
      ];
      await new Promise((r) => setTimeout(r, 500)); // simular delay
      setHistoricalData(mockHistory);
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
        <div style={{ marginTop: "24px", maxWidth: "700px", marginInline: "auto" }}>
          <h2 className="text-lg font-semibold mb-2">
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
                  stroke="#0070f3"
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
