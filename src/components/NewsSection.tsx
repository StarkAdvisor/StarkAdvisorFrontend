import React, { useState, useEffect } from "react";

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
  sentiment: Sentiment;
};

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [keyword, setKeyword] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // 🚀 Fetch al backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/news/` // 👈 endpoint del backend
        );
        if (!response.ok) throw new Error("Error al cargar noticias");
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError("No se pudieron cargar las noticias");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // 🔎 Filtrado local
  const filteredNews = news.filter((item) => {
    const matchesKeyword =
      keyword === "" ||
      item.title.toLowerCase().includes(keyword.toLowerCase()) ||
      item.description.toLowerCase().includes(keyword.toLowerCase());

    const matchesSource = source === "" || item.source === source;
    const matchesCategory = category === "" || item.category === category;

    const matchesDate =
      (!dateFrom || new Date(item.date) >= new Date(dateFrom)) &&
      (!dateTo || new Date(item.date) <= new Date(dateTo));

    return matchesKeyword && matchesSource && matchesCategory && matchesDate;
  });

  return (
    <section id="news" className="news">
      <h2>Noticias Financieras</h2>

      {/* 🔎 Filtros */}
      <div className="news-filters">
        <input
          type="text"
          placeholder="Buscar por palabra clave..."
          className="filter-input"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <select
          className="filter-select"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option value="">Todas las fuentes</option>
          <option value="CNN">CNN</option>
          <option value="Bloomberg">Bloomberg</option>
          <option value="Reuters">Reuters</option>
        </select>

        <select
          className="filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          <option value="Stock Market">Stock Market</option>
          <option value="Forex">Forex</option>
          <option value="Economía">Economía</option>
        </select>

        <div className="filter-dates">
          <label>Desde:</label>
          <input
            type="date"
            className="filter-date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <label>Hasta:</label>
          <input
            type="date"
            className="filter-date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </div>

      {/* Estado de carga */}
      {loading && <p>Cargando noticias...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 📰 Lista de noticias */}
      <div className="news-grid">
        {filteredNews.length > 0 ? (
          filteredNews.map((item) => (
            <div key={item._id} className="news-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>
                <strong>{item.source}</strong> ·{" "}
                {new Date(item.date).toLocaleDateString()}
              </p>
              <span
                style={{
                  color:
                    item.sentiment.label === "POSITIVE"
                      ? "green"
                      : item.sentiment.label === "NEGATIVE"
                      ? "red"
                      : "gray",
                }}
              >
                {item.sentiment.label} ({item.sentiment.score})
              </span>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                Leer más
              </a>
            </div>
          ))
        ) : (
          !loading && <p>No se encontraron noticias</p>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
