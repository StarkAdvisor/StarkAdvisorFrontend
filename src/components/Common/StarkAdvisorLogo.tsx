import React from 'react';

interface StarkAdvisorLogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'white' | 'primary' | 'dark';
}

const StarkAdvisorLogo: React.FC<StarkAdvisorLogoProps> = ({ 
  size = 'medium', 
  color = 'white' 
}) => {
  const getSizeValue = () => {
    switch (size) {
      case 'small': return 24;
      case 'medium': return 32;
      case 'large': return 48;
      default: return 32;
    }
  };

  const getColor = () => {
    switch (color) {
      case 'white': return '#FFFFFF';
      case 'primary': return '#004080';
      case 'dark': return '#000000';
      default: return '#FFFFFF';
    }
  };

  const logoSize = getSizeValue();
  const logoColor = getColor();

  return (
    <svg 
      width={logoSize} 
      height={logoSize} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Círculo exterior */}
      <circle 
        cx="50" 
        cy="50" 
        r="48" 
        stroke={logoColor} 
        strokeWidth="4" 
        fill="none"
      />
      
      {/* Símbolo de dólar */}
      <text 
        x="25" 
        y="40" 
        fontSize="20" 
        fontWeight="bold" 
        fill={logoColor}
      >
        $
      </text>
      
      {/* Flecha hacia arriba */}
      <path 
        d="M35 65 L60 40 L85 65" 
        stroke={logoColor} 
        strokeWidth="3" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Línea vertical de la flecha */}
      <line 
        x1="60" 
        y1="40" 
        x2="60" 
        y2="70" 
        stroke={logoColor} 
        strokeWidth="3" 
        strokeLinecap="round"
      />
      
      {/* Barras del gráfico */}
      <rect x="40" y="55" width="4" height="15" fill={logoColor} />
      <rect x="46" y="50" width="4" height="20" fill={logoColor} />
      <rect x="52" y="45" width="4" height="25" fill={logoColor} />
      <rect x="58" y="40" width="4" height="30" fill={logoColor} />
      <rect x="64" y="48" width="4" height="22" fill={logoColor} />
      <rect x="70" y="52" width="4" height="18" fill={logoColor} />
    </svg>
  );
};

export default StarkAdvisorLogo;