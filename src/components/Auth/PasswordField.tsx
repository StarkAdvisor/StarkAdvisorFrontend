import React, { useState } from 'react';
import './PasswordField.css';

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  showValidation?: boolean;
  validationRules?: {
    minLength?: number;
    notNumeric?: boolean;
    notCommon?: boolean;
  };
}

interface ValidationStatus {
  minLength: boolean;
  notNumeric: boolean;
  notCommon: boolean;
}

const COMMON_PASSWORDS = [
  '12345678', '123456789', '1234567890',
  'password', 'password123', '123123123',
  '87654321', '11111111', '00000000',
  'qwerty123', 'abc123456'
];

const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  showValidation = false,
  validationRules = { minLength: 8, notNumeric: true, notCommon: true }
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password: string): ValidationStatus => {
    return {
      minLength: password.length >= (validationRules.minLength || 8),
      notNumeric: !validationRules.notNumeric || !/^\d+$/.test(password),
      notCommon: !validationRules.notCommon || !COMMON_PASSWORDS.includes(password.toLowerCase())
    };
  };

  const validation = validatePassword(value);
  const isValid = Object.values(validation).every(v => v);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="password-field-container">
      <label htmlFor={id} className="password-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      
      <div className="password-input-wrapper">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`password-input ${showValidation ? (isValid ? 'valid' : 'invalid') : ''}`}
        />
        
        <button
          type="button"
          className="password-toggle"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>

      {showValidation && value.length > 0 && (
        <div className="password-validation">
          <div className={`validation-item ${validation.minLength ? 'valid' : 'invalid'}`}>
            <span className="validation-icon">
              {validation.minLength ? '✅' : '❌'}
            </span>
            Mínimo {validationRules.minLength || 8} caracteres
          </div>
          
          {validationRules.notNumeric && (
            <div className={`validation-item ${validation.notNumeric ? 'valid' : 'invalid'}`}>
              <span className="validation-icon">
                {validation.notNumeric ? '✅' : '❌'}
              </span>
              No solo números
            </div>
          )}
          
          {validationRules.notCommon && (
            <div className={`validation-item ${validation.notCommon ? 'valid' : 'invalid'}`}>
              <span className="validation-icon">
                {validation.notCommon ? '✅' : '❌'}
              </span>
              No muy común (ej: 12345678)
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordField;
