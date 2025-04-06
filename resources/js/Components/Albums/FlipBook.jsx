import { useState, useRef } from "react";
import React from 'react';
import HTMLFlipBook from "react-pageflip";

export default function FlipBook({ isOpen, onClose, album }) {

  if (!isOpen) return null;

  // Referencia para el flipbook
  const flipBookRef = useRef(null);

  // Estado para la página actual
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const postsImpares = album.posts.length % 2 !== 0;

  // Funciones para manejar los eventos
  const onPage = (e) => {
    setPage(flipBookRef.current.pageFlip().getCurrentPageIndex() + 1);
    setTotalPages(flipBookRef.current.pageFlip().getPageCount());
    console.log('Página volteada:', e);
  };

  const onChangeOrientation = (e) => {
    console.log('Orientación cambiada:', e);
  };

  const onChangeState = (e) => {
    console.log('Estado cambiado:', e);
  };

  // Funciones para el control de las páginas
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

  const width = window.innerWidth;
  const height = width * (2 / 3);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden">
      {/* Modal ocupa todo el viewport */}
      <div className="bg-white p-0 rounded-lg shadow-xl w-full h-full flex flex-col items-center overflow-hidden">
        {/* Título del álbum */}
        <h2 className="text-2xl font-semibold mb-4 absolute top-4 left-1/2 transform -translate-x-1/2 z-10">{album.nombre}</h2>

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
            {/* Portada como una página dura */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="page-content w-full h-full">
                <img
                  src={`/storage/${album.portada}?t=${new Date().getTime()}`}
                  alt={album.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Páginas del álbum */}
            {album.posts.map((post, index) => (
              <div key={index} className="w-full h-full flex items-center justify-center">
                <div className="page-content w-full h-full">
                  <img
                    src={`/storage/${post.photo.url}?t=${new Date().getTime()}`}
                    alt={post.photo.localizacion || `Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}

            {postsImpares ? (
            <>
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                {/* Página vacía */}
                </div>

                <div className="w-full h-full flex items-center justify-center">
                <div className="page-content w-full h-full">
                    <img
                    src={`/storage/${album.portada}?t=${new Date().getTime()}`}
                    alt={album.nombre}
                    className="w-full h-full object-cover"
                    />
                </div>
                </div>
            </>
            ) : (
            // Si no hay página vacía (postsImpares es false)
            <div className="w-full h-full flex items-center justify-center">
                <div className="page-content w-full h-full">
                <img
                    src={`/storage/${album.portada}?t=${new Date().getTime()}`}
                    alt={album.nombre}
                    className="w-full h-full object-cover"
                />
                </div>
            </div>
            )}

          </HTMLFlipBook>
        </div>

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
