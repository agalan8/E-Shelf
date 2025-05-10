import { useState, useEffect, useRef } from "react";
import React from 'react';
import HTMLFlipBook from "react-pageflip";

export default function FlipBook({ isOpen, onClose, album }) {
  if (!isOpen) return null;

  // Referencia para el flipbook
  const flipBookRef = useRef(null);

  // Estado para manejar el álbum completo
  const [currentAlbum, setCurrentAlbum] = useState(album);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pages, setPages] = useState([]);  // Nuevo estado para manejar las páginas

  // Actualizar el estado del álbum cuando cambie el prop `album`
  useEffect(() => {
    setCurrentAlbum(album);
    // Comprobar si el número de posts es impar
    const updatedPages = [...album.posts];

    // Si el número de posts es impar, añadir una página vacía antes de la contraportada
    if (updatedPages.length % 2 !== 0) {
      updatedPages.push(null); // Añadimos una página vacía representada por `null`
    }

    // Establecer las páginas actualizadas
    setPages(updatedPages);
  }, [album]); // Se ejecuta cada vez que cambia `album`

  // Función que se ejecuta cuando el flipbook cambia de página
  const onPage = () => {
    if (flipBookRef.current) {
      setPage(flipBookRef.current.pageFlip().getCurrentPageIndex() + 1);
      setTotalPages(flipBookRef.current.pageFlip().getPageCount());
    }
  };

  const onChangeOrientation = (e) => {
    console.log('Orientación cambiada:', e);
  };

  const onChangeState = (e) => {
    console.log('Estado cambiado:', e);
  };

  // Funciones para controlar la navegación entre páginas
  const nextButtonClick = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const prevButtonClick = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  // Definir el tamaño de las páginas del flipbook
  const width = window.innerWidth;
  const height = width * (2 / 3);

  // Verificar si cover_image está disponible o no
  const coverImageUrl = currentAlbum.cover_image ? `${currentAlbum.cover_image.path_original}?t=${new Date().getTime()}` : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden">
      <div className="bg-white p-0 rounded-lg shadow-xl w-full h-full flex flex-col items-center overflow-hidden">
        {/* Título del álbum */}
        <h2 className="text-2xl font-semibold mb-4 absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          {currentAlbum.nombre}
        </h2>

        <div className="flex items-center justify-center w-full h-full flex-grow overflow-hidden pl-10 pr-10">
          <HTMLFlipBook
            width={width} // Se ajusta al tamaño del modal
            height={height} // Se ajusta al tamaño del modal
            size="stretch"
            minWidth={315}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1533}
            maxShadowOpacity={0.5}
            drawShadow={true}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={onPage}
            onChangeOrientation={onChangeOrientation}
            onChangeState={onChangeState}
            ref={flipBookRef}
          >
            {/* Portada del álbum */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="page-content w-full h-full">
                {coverImageUrl ? (
                  <img
                    src={coverImageUrl}
                    alt={currentAlbum.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white flex items-center justify-center">
                    <span className="text-gray-500">Sin portada</span>
                  </div>
                )}
              </div>
            </div>

            {/* Páginas del álbum */}
            {pages.map((post, index) => (
              post ? (
                <div key={index} className="w-full h-full flex items-center justify-center">
                  <div className="page-content w-full h-full">
                    <img
                      src={`${post.image.path_original}?t=${new Date().getTime()}`}
                      alt={post.image.localizacion || `Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                // Si es una página vacía (null), crear una página vacía
                <div key={index} className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="page-content w-full h-full"></div>
                </div>
              )
            ))}

            {/* Contraportada del álbum */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="page-content w-full h-full">
                {coverImageUrl ? (
                  <img
                    src={coverImageUrl}
                    alt={currentAlbum.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white flex items-center justify-center">
                    <span className="text-gray-500">Sin portada</span>
                  </div>
                )}
              </div>
            </div>

          </HTMLFlipBook>
        </div>

        {/* Controles de navegación */}
        <div className="container">
          <div>
            <button type="button" onClick={prevButtonClick}>
              Página anterior
            </button>
            <span> {page}</span> de <span> {totalPages} </span>
            <button type="button" onClick={nextButtonClick}>
              Siguiente página
            </button>
          </div>
        </div>

        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-900 absolute top-2 right-2 z-10"
        >
          ✖
        </button>
      </div>
    </div>
  );
}
