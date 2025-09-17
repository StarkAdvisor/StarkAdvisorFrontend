import React, { useEffect, useState } from "react";

interface Activo {
  simbolo: string;
  nombre: string;
  precio: number;
  cambio: string;
}

const MercadoFinanciero: React.FC = () => {
  const [categoria, setCategoria] = useState<"acciones" | "etfs" | "divisas">(
    "acciones"
  );
  const [activos, setActivos] = useState<Activo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Función para cargar datos desde el back-end
  const fetchData = async (cat: "acciones" | "etfs" | "divisas") => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`http://localhost:4000/api/${cat}`);
      if (!response.ok) {
        throw new Error("Error al obtener datos del servidor");
      }
      const data: Activo[] = await response.json();
      setActivos(data);
    } catch (err) {
      setError("No se pudieron cargar los datos 😢");
    } finally {
      setLoading(false);
    }
  };

  // Cuando cambie la categoría, pedimos datos
  useEffect(() => {
    fetchData(categoria);
  }, [categoria]);

return (
  <div className="financial-market">
    <h1>📊 Mercado Financiero</h1>

    {/* Selector de categoría */}
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

    {/* Mostrar estados */}
    {loading && <p>Cargando datos...</p>}
    {error && <p className="error">{error}</p>}

    {/* Tabla de resultados */}
    {!loading && !error && (
      <table className="market-table">
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
            <tr key={index}>
              <td>{item.simbolo}</td>
              <td>{item.nombre}</td>
              <td>{item.precio}</td>
              <td
                className={Number(item.cambio) < 0 ? "negative" : "positive"}
                >
                {item.cambio}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

};

export default MercadoFinanciero;
