import React, { useState } from 'react';

const Image = ({ src, alt, className, style, ...props }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  return (

      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-200 ${className}`} // No modifica las clases adicionales
        style={{
          ...style,
          filter: isImageLoaded ? 'none' : 'blur(10px)', // Solo aplica el blur durante la carga
          opacity: isImageLoaded ? 1 : 0, // Control de opacidad
          transition: 'filter 0.2s ease-out, opacity 0.2s ease-out', // Transición suave
        }}
        loading="lazy"
        onLoad={handleImageLoad}
        {...props}
      />

  );
};

export default Image;
