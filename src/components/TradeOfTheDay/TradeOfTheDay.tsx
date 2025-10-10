import React, { useEffect, useState } from 'react';
import './TradeOfTheDay.css';

/** Backend (usar env en prod si está definida) */
const API_URL =
  (process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL.replace(/\/+$/, '')}/api/trade-of-the-day/`
    : 'http://localhost:8000/api/trade-of-the-day/');

type Direction = 'LONG' | 'SHORT';

/** Lo que devuelve tu backend */
type ApiRow = {
  ticker: string;
  price: number | string;
  avg_forward_return_21d: number | string; // "6.59" | 6.59 | 0.0659
  insights: string[] | string;
  date: string;
};

/** Tipos del front */
type TradeCard = {
  symbol: string;
  forwardDays: number;  // 21
  changePct: number;    // en % (ej: 6.59)
  price: number;
  bullets: string[];
  date: string;         // YYYY-MM-DD
};

/* ===== Helpers ===== */
const toDateYMD = (s: string) => {
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toISOString().slice(0, 10);
};

function toNumber(x: unknown, def = 0): number {
  const n = typeof x === 'string' ? Number(x) : typeof x === 'number' ? x : NaN;
  return Number.isFinite(n) ? n : def;
}

/** Normaliza a porcentaje:
 *  - si viene 0.0659 => 6.59
 *  - si viene 6.59   => 6.59
 */
function toPercent(val: number): number {
  if (!Number.isFinite(val)) return 0;
  return val <= 1 && val >= -1 ? val * 100 : val;
}

const mapApiToCard = (row: ApiRow): TradeCard => {
  const rawPct = toNumber(row.avg_forward_return_21d, 0);
  const pct = toPercent(rawPct);

  const rawBullets = Array.isArray(row.insights)
    ? row.insights
    : typeof row.insights === 'string'
    ? row.insights.split('|').map(s => s.trim()).filter(Boolean)
    : [];

  return {
    symbol: String(row.ticker || '').toUpperCase(),
    forwardDays: 21,
    changePct: pct,
    price: toNumber(row.price, 0),
    bullets: rawBullets,
    date: toDateYMD(row.date || ''),
  };
};

/** Mini-serie para la sparkline (si luego tienes serie real, pásala ahí) */
function generateSeries(avgPct: number): number[] {
  const n = 24;
  const bias = Math.max(-2, Math.min(2, avgPct / 5)); // -2..2 según rendimiento
  const arr = [100];
  for (let i = 1; i < n; i++) {
    const prev = arr[i - 1];
    const step = (Math.random() - 0.5) * 2 + bias * 0.4;
    arr.push(prev + step);
  }
  return arr;
}

/* ===== Banner superior (solo 1 pestaña) + Select de orden ===== */
const TopBar: React.FC<{
  order: 'desc' | 'asc';
  onChangeOrder: (v: 'desc' | 'asc') => void;
}> = ({ order, onChangeOrder }) => (
  <div className="tod-tabs surface">
    <div className="tod-tabs__left">
      <button className="tab active" disabled>
        Plataforma de información financiera
      </button>
    </div>

    {/* Selector desplegable de orden (aplica SIEMPRE al listado) */}
    <div className="tod-tabs__right">
      <label className="tod-order">
        <span className="tod-order__label">Orden:</span>
        <select
          className="tod-order__select"
          value={order}
          onChange={(e) => onChangeOrder(e.target.value as 'desc' | 'asc')}
        >
          <option value="desc">Mayor → Menor rendimiento</option>
          <option value="asc">Menor → Mayor rendimiento</option>
        </select>
      </label>
    </div>
  </div>
);

/* ===== Card de listado ===== */
const Card: React.FC<{ t: TradeCard; onSelect: (sym: string) => void }> = ({ t, onSelect }) => {
  const pct = t.changePct.toFixed(2) + '%';
  const pctColor =
    t.changePct > 0 ? 'var(--color-success)' :
    t.changePct < 0 ? 'var(--color-error)'  :
                      'var(--color-gray-medium)';

  return (
    <article
      className="tile surface"
      /* role="article"  <- redundante; se elimina para cumplir eslint jsx-a11y/no-redundant-roles */
      style={{ color: 'var(--color-black)' }}
      onClick={() => onSelect(t.symbol)}
    >
      <div className="tile__head">
        <div className="tile__title" style={{ color: 'var(--color-black)' }}>
          <span className="symbol" style={{ color: 'var(--color-black)' }}>{t.symbol}</span>
          <span className="forward" style={{ color: 'var(--color-gray-medium)' }}>
            Forward {t.forwardDays}d.
          </span>
          <span className="pct" style={{ color: pctColor }}>{pct}</span>
        </div>
        <div className="tile__price" style={{ color: 'var(--color-black)' }}>
          ${t.price.toFixed(2)}
        </div>
      </div>

      <ul className="tile__bullets" style={{ color: 'var(--color-gray-medium)' }}>
        {t.bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>

      <div className="tile__foot" style={{ borderTopColor: 'rgba(0,0,0,0.12)' }}>
        <span className="date" style={{ color: 'var(--color-gray-medium)' }}>{t.date}</span>
      </div>
    </article>
  );
};

/* ===== Sparkline ===== */
const Sparkline: React.FC<{ points: number[] }> = ({ points }) => {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const W = 220, H = 52, P = 6;

  const d = points.map((v, i) => {
    const x = P + (i * (W - 2 * P)) / (points.length - 1);
    const y = H - P - ((v - min) / (max - min || 1)) * (H - 2 * P);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  return (
    <svg width={W} height={H} className="tod-sparkline" role="img" aria-label="mini chart">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};

/* ===== Detalle (CON gráfica y SIN botones) ===== */
const TradeDetail: React.FC<{ base: TradeCard | null }> = ({ base }) => {
  if (!base) return null;

  const avg = base.changePct; // ya en %
  const dir: Direction = avg >= 0 ? 'LONG' : 'SHORT';
  const rr = 2.5;
  const entry = base.price;
  const stop = dir === 'LONG' ? entry * 0.985 : entry * 1.015;
  const target = dir === 'LONG'
    ? entry * (1 + Math.abs(avg) / 0.6)
    : entry * (1 - Math.abs(avg) / 0.6);
  const confidence = Math.max(55, Math.min(92, Math.round(Math.abs(avg) * 9)));

  const risk = Math.abs(entry - stop);
  const reward = Math.abs(target - entry);
  const dirColor = dir === 'LONG' ? 'var(--color-success)' : 'var(--color-error)';

  // Serie de ejemplo derivada
  const demoSeries = generateSeries(avg);

  const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    <span className="tod-badge" style={{ color: 'var(--color-black)' }}>{children}</span>;

  const Metric: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="tod-metric">
      <span className="tod-metric__label" style={{ color: 'var(--color-gray-medium)' }}>{label}</span>
      <span className="tod-metric__value" style={{ color: 'var(--color-black)' }}>{value}</span>
    </div>
  );

  return (
    <section className="tod-wrapper">
      <header className="tod-header surface" style={{ color: 'var(--color-black)' }}>
        <div>
          <h1 className="tod-title" style={{ color: 'var(--color-black)' }}>Trade del Día</h1>
          <p className="tod-subtitle" style={{ color: 'var(--color-gray-medium)' }}>
            Selección curada según el plan de trading diario
          </p>
        </div>
        <div className="tod-header__right">
          <Badge>STOCK</Badge>
          <Badge>H1</Badge>
          <Badge>{base.date}</Badge>
        </div>
      </header>

      <div className="tod-grid">
        <article className="tod-card surface" style={{ color: 'var(--color-black)' }}>
          <div className="tod-row">
            <div className="tod-symbol">
              <span className="tod-ticker" style={{ color: 'var(--color-black)' }}>{base.symbol}</span>
              <span className="tod-setup">Breakout + Retest</span>
            </div>
            <div className="tod-direction" style={{ color: dirColor }}>{dir}</div>
          </div>

          <p className="tod-thesis" style={{ color: 'var(--color-black)' }}>
            {base.bullets[0] ?? 'Sesgo técnico favorable con confluencia de señales.'}
          </p>

          <div className="tod-chart" style={{ color: 'var(--color-black)' }}>
            <Sparkline points={demoSeries} />
          </div>

          <div className="tod-metrics">
            <Metric label="Entrada" value={<span>{entry.toFixed(2)}</span>} />
            <Metric label="Stop" value={<span>{stop.toFixed(2)}</span>} />
            <Metric label="Objetivo" value={<span>{target.toFixed(2)}</span>} />
            <Metric label="R:R" value={<span>{rr.toFixed(2)}x</span>} />
            <Metric label="Riesgo" value={<span>{Math.abs(entry - stop).toFixed(2)}</span>} />
            <Metric label="Recompensa" value={<span>{Math.abs(target - entry).toFixed(2)}</span>} />
            <Metric label="Confianza" value={<span>{confidence}%</span>} />
          </div>
        </article>

        <aside className="tod-card surface" style={{ color: 'var(--color-black)' }}>
          <h2 className="tod-section-title" style={{ color: 'var(--color-black)' }}>Notas & Gestión</h2>
          <ul className="tod-list" style={{ color: 'var(--color-black)' }}>
            {base.bullets.slice(0, 3).map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </aside>
      </div>
    </section>
  );
};

/* ===== Vista principal ===== */
const TradeOfTheDay: React.FC = () => {
  const [order, setOrder] = useState<'desc' | 'asc'>('desc'); // select desplegable
  const [cards, setCards] = useState<TradeCard[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Cargar data
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw: ApiRow[] = await res.json();
        if (!alive) return;
        const normalized = raw.map(mapApiToCard);
        setCards(normalized);
        const initial = normalized.length ? normalized[0].symbol : null;
        setSelected(initial);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || 'No se pudo cargar el listado.');
      } finally {
        alive && setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Ordenar SIEMPRE según select
  const list = (() => {
    const arr = [...cards];
    arr.sort((a, b) => {
      const va = a.changePct;
      const vb = b.changePct;
      return order === 'desc' ? vb - va : va - vb;
    });
    return arr;
  })();

  // Mantener selección al cambiar lista; si el seleccionado ya no existe, tomar el primero
  useEffect(() => {
    if (!list.length) {
      setSelected(null);
      return;
    }
    if (!selected || !list.some(c => c.symbol === selected)) {
      setSelected(list[0].symbol);
    }
  }, [list, selected]);

  // Card seleccionada para el detalle
  const selectedCard = list.find(c => c.symbol === selected) ?? null;

  return (
    <section className="tod-page">
      <TopBar order={order} onChangeOrder={setOrder} />

      {loading && <p style={{ margin: 8 }}>Cargando…</p>}
      {err && <p style={{ margin: 8, color: 'var(--color-error, #b91c1c)' }}>{err}</p>}

      <div className="grid">
        {list.map((t) => (
          <Card key={t.symbol} t={t} onSelect={setSelected} />
        ))}
      </div>

      <TradeDetail base={selectedCard} />
    </section>
  );
};

export default TradeOfTheDay;
