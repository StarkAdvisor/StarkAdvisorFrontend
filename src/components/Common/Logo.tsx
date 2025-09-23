import React from 'react';
import './Logo.css';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', variant = 'light' }) => {
  return (
    <div className={`stark-logo ${size} ${variant}`}>
      <div className="logo-icon">
        <div className="logo-circle">
          <div className="logo-dollar">$</div>
          <div className="logo-chart">
            <div className="chart-bar bar1"></div>
            <div className="chart-bar bar2"></div>
            <div className="chart-bar bar3"></div>
            <div className="chart-arrow">↗</div>
          </div>
        </div>
      </div>
      <div className="logo-text">
        <span className="logo-stark">Stark</span>
        <span className="logo-advisor">Advisor</span>
      </div>
    </div>
  );
};

export default Logo;