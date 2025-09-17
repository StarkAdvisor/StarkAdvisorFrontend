import React, { useState } from "react";
import CryptoChart from "./components/CryptoChart";
import NewsSection from "./components/NewsSection";
import MercadoFinanciero from "./components/MercadoFinanciero";
import "./App.css";

type TabType = "Acciones" | "ETFs" | "Forex";

type MarketEntry = {
  name: string;
  value: number;
  change: number;
  currency: string;
};

const marketData: Record<TabType, MarketEntry[]> = {
  Acciones: [
    { name: "Apple", value: 175.12, change: +1.25, currency: "USD" },
    { name: "Microsoft", value: 312.45, change: -0.87, currency: "USD" },
    { name: "TSLA", value: 255.18, change: 2.5, currency: "USD" },
  ],
  ETFs: [
    { name: "SPY", value: 456.78, change: +0.45, currency: "USD" },
    { name: "QQQ", value: 378.90, change: -1.12, currency: "USD" },
    { name: "DIA", value: 350.75, change: 0.4, currency: "USD" },
  ],
  Forex: [
    { name: "EUR/USD", value: 1.0845, change: -0.21, currency: "" },
    { name: "USD/JPY", value: 146.32, change: +0.35, currency: "" },
    { name: "GBP/USD", value: 1.265, change: 0.3, currency: "" },
  ],
};

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("Acciones");

  const sampleChartData = [
    { time: "10:00", price: 100 },
    { time: "10:05", price: 102 },
    { time: "10:10", price: 101 },
    { time: "10:15", price: 103 },
    { time: "10:20", price: 105 },
  ];

  return (
    <div className="App">
      {/* Navbar */}
      <header className="App-header">
        <div className="logo">StarkAdvisor</div>
        <nav className="nav-links">
          <input type="text" placeholder="Search" className="search-box" />
          <a href="#market-summary">Market Summary</a>
          <a href="#news">Noticias / News</a>
          <a href="#footer">Sobre Nosotros</a>
        </nav>
        <div className="header-actions">
          <button className="btn-secondary">LOGIN</button>
          <button className="btn-primary">REGISTRARSE</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>StarkAdvisor.</h1>
          <p>The best trades require research, then commitment.</p>
          <button className="btn-primary">Get started for free</button>
        </div>
      </section>

      {/* Market Summary */}
      <section id="market-summary" className="market-summary">
        <h2>Market summary</h2>

        {/* Tabs */}
        <div className="tabs">
          {(Object.keys(marketData) as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? "tab active" : "tab-btn"}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="tab-content">
          {marketData[activeTab].length === 0 ? (
            <p>No data available</p>
          ) : (
            marketData[activeTab].map((entry) => (
              <div key={entry.name} className="market-entry">
                <strong>{entry.name}</strong>
                <p>
                  {entry.value.toLocaleString()} {entry.currency}{" "}
                  <span style={{ color: entry.change < 0 ? "red" : "green" }}>
                    {entry.change > 0 ? "+" : ""}
                    {entry.change}%
                  </span>
                </p>

                {/* 🎯 Gráfico pequeño */}
                <div className="chart-container">
                  <CryptoChart name={entry.name} data={sampleChartData} />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Noticias → ahora en componente externo */}
      <NewsSection  />

      {/* Mercado Financiero */}
      <MercadoFinanciero />

      {/* Footer */}
      <footer className="footer" id="footer">
        <div className="footer-container">
          <div className="footer-left">
            <h4>StarkAdvisor</h4>
            <p>Tu aliado inteligente en inversiones financieras.</p>
          </div>
          <div className="footer-right">
            <div className="footer-column">
              <h4>More than a product</h4>
              <p>Innovación</p>
              <p>Confianza</p>
            </div>
            <div className="footer-column">
              <h4>Contact Info</h4>
              <p>Email: contacto@starkadvisor.com</p>
              <p>Tel: +57 123 456 7890</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
