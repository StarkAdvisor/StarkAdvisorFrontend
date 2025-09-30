import React, { useEffect, useMemo, useState } from 'react';
import './NewsFeed.css';

type Sentiment = 'POSITIVE' | 'NEGATIVE';
type NewsItem = {
  id: string;
  title: string;
  description?: string;
  url: string;
  source?: string;
  category?: string;
  published_at?: string;
  sentiment: Sentiment;
  sentiment_score?: number;
};

const PRESET_CATEGORIES = [
  "all", "Stock Market", "Interest Rates", "Federal Reserve Policies", "S&P 500",
  "Banking Sector", "Mutual Funds & ETFs", "Corporate Earnings",
  "US Economy & Inflation", "Budget & Fiscal Policies", "Tech Sector",
  "Energy Sector", "Healthcare & Pharma", "Consumer Goods",
  "Apple", "Microsoft", "Amazon", "Alphabet", "Meta",
  "Tesla", "NVIDIA"
];

export default function NewsFeed(): JSX.Element {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [category, setCategory] = useState("all");                 
  const [selectedSources, setSelectedSources] = useState<string[]>([]);   
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'sentiment-desc' | 'sentiment-asc'>('date-desc');
  const [loading, setLoading] = useState(false);

  // ✅ ahora las fuentes se traen desde backend
  const [allSources, setAllSources] = useState<string[]>([]);

  // fetch de fuentes
  async function fetchSources() {
    try {
      const resp = await fetch("http://localhost:8000/api/news/sources");
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setAllSources(data.sources ?? []);
    } catch (err) {
      console.error("Error fetching sources:", err);
      setAllSources([]);
    }
  }

  const remainingSources = useMemo(
    () => allSources.filter(s => !selectedSources.includes(s)),
    [allSources, selectedSources]
  );

  const addSource = (src: string) => {
    if (!src) return;
    setSelectedSources(prev => prev.includes(src) ? prev : [...prev, src]);
  };
  const removeSource = (src: string) => setSelectedSources(prev => prev.filter(s => s !== src));
  const clearSources = () => setSelectedSources([]);

  // helper para porcentaje/width
  const scorePercent = (n?: number) => `${Math.round(((n ?? 0.6) * 100))}%`;
  const scoreWidth = (n?: number) => `${Math.max(0, Math.min(100, Math.round(((n ?? 0.6)) * 100)))}%`;
  const pillClass = (s: Sentiment) => s === 'POSITIVE' ? 'nf-pill nf-pill--pos' : 'nf-pill nf-pill--neg';


  // ====== Fetch helper ======
  // fetchNews puede recibir fechas explícitas (útil para la carga inicial)
  async function fetchNews(opts?: { start?: string; end?: string; }) {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append('max_articles', '100'); // ✅ ahora 50 en lugar de 30

      const start = opts?.start ?? startDate;
      const end = opts?.end ?? endDate;
      if (start) params.append('start', start);
      if (end) params.append('end', end);

      // category se envía como q si no es 'all'
      if (category && category !== 'all') {
        params.append('q', category);
      }

      if (selectedSources.length > 0) {
        // unir con comas (el backend espera "CNN,Financial Times")
        params.append('source', selectedSources.join(','));
      }

      const url = `http://localhost:8000/api/news/?${params.toString()}`;
      console.log('Fetching news ->', url);

      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      const data = await resp.json();

      // Adaptar formato del backend al tipo NewsItem
      let mapped: NewsItem[] = Array.isArray(data)
        ? data.map((d: any) => ({
          id: d._id,
          title: d.title,
          description: d.description,
          url: d.url,
          source: d.source,
          category: d.category,
          published_at: d.date ? new Date(d.date).toISOString().split("T")[0] : undefined, // YYYY-MM-DD
          sentiment: d.sentiment?.label === "POSITIVE" ? "POSITIVE" : "NEGATIVE",
          sentiment_score: d.sentiment?.score ?? 0.5,
        }))
        : [];

      // ✅ Revolver aleatoriamente el arreglo (Fisher-Yates shuffle)
      for (let i = mapped.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mapped[i], mapped[j]] = [mapped[j], mapped[i]];
      }

      setItems(mapped);

    } catch (err) {
      console.error('Error fetching news:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }


  // ====== Carga inicial: últimos 4 meses, luego traer primeras 30 ======
  useEffect(() => {
    const now = new Date();
    const past = new Date(now);
    past.setMonth(now.getMonth() - 4);

    const isoNow = now.toISOString().split('T')[0];
    const isoPast = past.toISOString().split('T')[0];

    // setear inputs y hacer fetch con esas fechas (usar opts para garantizar las fechas enviadas)
    setStartDate(isoPast);
    setEndDate(isoNow);

    // fetch inicial: sin `q` (si category es 'all') para que backend devuelva sus predeterminadas
    fetchNews({ start: isoPast, end: isoNow });
     fetchSources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ====== Render lista (sólo ordenamiento cliente) ======
  const displayed = useMemo(() => {
    const list = [...items];
    if (sortBy === 'date-desc') list.sort((a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime());
    else if (sortBy === 'date-asc') list.sort((a, b) => new Date(a.published_at ?? 0).getTime() - new Date(b.published_at ?? 0).getTime());
    else if (sortBy === 'sentiment-desc') list.sort((a, b) => (b.sentiment_score ?? 0.6) - (a.sentiment_score ?? 0.6));
    else list.sort((a, b) => (a.sentiment_score ?? 0.6) - (b.sentiment_score ?? 0.6));
    return list;
  }, [items, sortBy]);
/// ====== UI ======
return (
  <section className="nf-root container">
    <header className="nf-header">
      <h1 className="nf-title">Noticias</h1>

      <div className="nf-controls">

        {/* Categoría (query q) */}
        <select
          className="form-input nf-select"
          value={category}
          onChange={e => setCategory(e.target.value)}
          aria-label="Categoría de noticias"
        >
          {PRESET_CATEGORIES.map(c => (
            <option key={c} value={c}>
              {c === 'all' ? 'Todas las categorías' : c}
            </option>
          ))}
        </select>

        {/* Fuentes */}
        <div className="nf-sources">
          <label className="nf-sources__label">Fuentes</label>
          <div className="nf-sources__box">
            <div className="nf-sources__chips" role="list">
              {selectedSources.length === 0 && (
                <div className="nf-sources__hint">Todas</div>
              )}
              {selectedSources.map(src => (
                <div className="nf-source-chip" key={src} role="listitem">
                  <span className="nf-source-chip__text" title={src}>{src}</span>
                  <button
                    className="nf-source-chip__remove"
                    onClick={() => removeSource(src)}
                    aria-label={`Quitar ${src}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="nf-sources__actions">
              <select
                className="form-input nf-sources__select"
                value=""
                onChange={e => { addSource(e.target.value); (e.target as HTMLSelectElement).value = ''; }}
                aria-label="Añadir fuente"
              >
                <option value="">Añadir fuente…</option>
                {remainingSources.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {selectedSources.length > 0 && (
                <button
                  className="btn-link nf-sources__clear"
                  onClick={clearSources}
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Rango de fechas */}
        <div className="nf-daterange">
          <span className="nf-daterange__label">Rango de fechas</span>
          <div className="nf-daterange__shell">
            <input
              type="date"
              className="nf-daterange__input"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              aria-label="Desde"
            />
            <span className="nf-daterange__sep">—</span>
            <input
              type="date"
              className="nf-daterange__input"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              aria-label="Hasta"
            />
            <button
              type="button"
              className="nf-quick nf-daterange__clear"
              onClick={() => { setStartDate(''); setEndDate(''); }}
            >
              Limpiar
            </button>
          </div>
          <div className="nf-daterange__quick">
            <button type="button" className="nf-quick" onClick={() => {
              const d = new Date(); const iso = d.toISOString().split('T')[0];
              setStartDate(iso); setEndDate(iso);
            }}>Hoy</button>
            <button type="button" className="nf-quick" onClick={() => {
              const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 6);
              setStartDate(start.toISOString().split('T')[0]); setEndDate(end.toISOString().split('T')[0]);
            }}>7d</button>
            <button type="button" className="nf-quick" onClick={() => {
              const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 29);
              setStartDate(start.toISOString().split('T')[0]); setEndDate(end.toISOString().split('T')[0]);
            }}>30d</button>
            <button type="button" className="nf-quick" onClick={() => {
              const now = new Date(); const start = new Date(now.getFullYear(), 0, 1);
              setStartDate(start.toISOString().split('T')[0]); setEndDate(new Date().toISOString().split('T')[0]);
            }}>YTD</button>
          </div>
        </div>

        {/* Orden */}
        <select
          className="form-input nf-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          aria-label="Ordenar por"
        >
          <option value="date-desc">Fecha: más recientes</option>
          <option value="date-asc">Fecha: más antiguas</option>
          <option value="sentiment-desc">Sentimiento: mayor → menor</option>
          <option value="sentiment-asc">Sentimiento: menor → mayor</option>
        </select>

        {/* Botón principal Buscar */}
        <button
          type="button"
          className="btn-primary nf-search-btn"
          onClick={() => fetchNews()}
        >
          Buscar
        </button>
      </div>
    </header>

    {loading ? (
      <div className="nf-loading">Cargando noticias…</div>
    ) : (
      <div className="nf-grid" role="list">
        {displayed.map(n => (
          <article className="nf-card" key={n.id} role="listitem">
            <div className="nf-row">
              <div className="nf-left">
                <div className={pillClass(n.sentiment)}>
                  {n.sentiment === 'POSITIVE' ? 'Positiva' : 'Negativa'}
                </div>
                <div className="nf-meta">
                  {n.source ?? '—'} • {n.published_at ?? '—'}
                </div>
              </div>
              <div className="nf-right">
                <a
                  className="btn-secondary nf-open"
                  href={n.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  ABRIR
                </a>
              </div>
            </div>

            <h3 className="nf-title-card" title={n.title}>{n.title}</h3>
            {n.description && <p className="nf-description">{n.description}</p>}

            <div className="nf-sentiment">
              <div className="nf-sentiment__track" aria-hidden>
                <div
                  className={`nf-sentiment__bar ${n.sentiment === 'POSITIVE' ? 'pos' : 'neg'}`}
                  style={{ width: scoreWidth(n.sentiment_score) }}
                />
              </div>
              <div className="nf-sentiment__score">{scorePercent(n.sentiment_score)}</div>
            </div>
          </article>
        ))}
        {displayed.length === 0 && (
          <div className="nf-empty">No hay noticias que coincidan.</div>
        )}
      </div>
    )}
  </section>
);
}