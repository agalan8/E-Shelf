import React, { useState } from "react";
import { IKImage } from "imagekitio-react";

const urlEndpoint = "https://ik.imagekit.io/eshelf/";

const Image = ({
  path,
  alt,
  transformation = [],
  className = '',
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);

  // Añadir la transformación de baja calidad (quality: 1)
  const lqipTransformation = [...transformation, { width: 20, quality: 100}];

  return (
    <div
      className={`relative overflow-hidden ${className}`}
    >
      {/* Imagen de baja calidad (blur), visible siempre */}
      {/* <IKImage
        urlEndpoint={urlEndpoint}
        path={path}
        alt={alt || "Imagen de baja calidad"}
        transformation={lqipTransformation}
        className= {`${className} object-cover absolute inset-0 z-0 filter blur-xl ${loaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700`}
      /> */}

      {/* Imagen final (comentada porque no la quieres ver aún) */}
      <IKImage
        urlEndpoint={urlEndpoint}
        path={path}
        alt={alt}
        transformation={transformation}
        onLoad={() => setLoaded(true)}
        className={`${className} relative z-10 transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
        loading="lazy"
      />
    </div>
  );
};

export default Image;
