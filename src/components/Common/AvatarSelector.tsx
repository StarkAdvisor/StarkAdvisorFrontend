import React, { useState } from 'react';
import './AvatarSelector.css';

interface AvatarSelectorProps {
  onAvatarChange: (avatar: File | null) => void;
  currentAvatar?: string | null;
  userName?: string;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ 
  onAvatarChange, 
  currentAvatar,
  userName = '' 
}) => {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen válida');
        return;
      }
      
      // Validar tamaño (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen debe ser menor a 2MB');
        return;
      }

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      onAvatarChange(file);
    }
  };

  const handleRemoveAvatar = () => {
    setPreview(null);
    onAvatarChange(null);
    
    // Limpiar input
    const input = document.getElementById('avatar-input') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  const getInitials = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="avatar-selector">
      <label className="avatar-label">
        Avatar (Opcional)
      </label>
      
      <div className="avatar-container">
        <div className="avatar-preview">
          {preview ? (
            <img src={preview} alt="Avatar preview" className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">
              <span className="avatar-initials">
                {getInitials(userName)}
              </span>
            </div>
          )}
        </div>
        
        <div className="avatar-actions">
          <input
            type="file"
            id="avatar-input"
            accept="image/*"
            onChange={handleFileChange}
            className="avatar-input"
          />
          <label htmlFor="avatar-input" className="avatar-button primary">
            📷 Seleccionar foto
          </label>
          
          {preview && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="avatar-button secondary"
            >
              🗑️ Quitar foto
            </button>
          )}
        </div>
      </div>
      
      <p className="avatar-help">
        Formatos: JPG, PNG, GIF. Máximo 2MB.
      </p>
    </div>
  );
};

export default AvatarSelector;