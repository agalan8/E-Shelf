import { useState, useEffect, useRef } from "react";
import React from "react";
import HTMLFlipBook from "react-pageflip";

export default function FlipBook({ isOpen, onClose, album }) {
  const [isVisible, setIsVisible] = useState(false);
  const flipBookRef = useRef(null);

  const [currentAlbum, setCurrentAlbum] = useState(album);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pages, setPages] = useState([]);

  // Estado para guardar si cada imagen es vertical
  const [isPortrait, setIsPortrait] = useState({});

  // Cuando se abre el modal, activar la animación
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Actualizar páginas si cambia el álbum
  useEffect(() => {
    setCurrentAlbum(album);
    const updatedPages = [...album.posts];
    if (updatedPages.length % 2 !== 0) {
      updatedPages.push(null);
    }
    setPages(updatedPages);
    setIsPortrait({}); // resetear estado cuando cambia álbum
  }, [album]);

  if (!isOpen) return null;

  const onPage = () => {
    if (flipBookRef.current) {
      setPage(flipBookRef.current.pageFlip().getCurrentPageIndex() + 1);
      setTotalPages(flipBookRef.current.pageFlip().getPageCount());
    }
  };

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

  const coverImageUrl = currentAlbum.cover_image
    ? currentAlbum.cover_image.path_original
    : null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Función para detectar si imagen es vertical y guardar resultado
  const handleImageLoad = (index) => (e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    const isVertical = naturalHeight > naturalWidth;

    setIsPortrait((prev) => {
      if (prev[index] === isVertical) return prev; // evita actualizar si no cambia
      return {
        ...prev,
        [index]: isVertical,
      };
    });
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-hidden transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-black bg-opacity-50 p-0 rounded-lg shadow-xl w-full h-full flex flex-col items-center overflow-hidden relative transform transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-5"
        }`}
      >
        <h2 className="text-2xl text-white font-semibold mb-4 absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          {currentAlbum.nombre}
        </h2>

        <div className="flex items-center justify-center w-full h-full flex-grow overflow-hidden px-10">
          <HTMLFlipBook
            width={width}
            height={height}
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
            ref={flipBookRef}
          >
            <div className="w-full h-full flex items-center justify-center bg-black">
              <div className="page-content w-full h-full">
                {coverImageUrl ? (
                  <img
                    src={coverImageUrl}
                    alt={currentAlbum.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <span className="text-gray-400">Sin portada</span>
                  </div>
                )}
              </div>
            </div>

            <div
              className="
              w-full h-full flex items-center justify-center
              bg-gradient-to-r from-purple-500 via-purple-700 to-purple-950
              shadow-lg
              relative
              "
            ></div>

            {pages.map((post, index) =>
              post ? (
                <div
                  key={index}
                  className="w-full h-full flex items-center justify-center bg-[#8F959F]"
                >
                  <div className="page-content w-full h-full">
                    <img
                      src={post.image.path_original}
                      alt={post.image.localizacion || `Photo ${index + 1}`}
                      onLoad={handleImageLoad(index)}
                      className={`w-full h-full bg-gradient-to-r from-gray-600 via-gray-200 to-gray-600 ${
                        isPortrait[index] ? "object-contain" : "object-cover"
                      }`}

                    />
                  </div>
                </div>
              ) : (
                <div
                  key={index}
                  className="
                    w-full h-full flex items-center justify-center
                    bg-gradient-to-tr from-gray-700 via-gray-600 to-gray-800
                    border border-gray-600
                    shadow-inner
                    rounded-sm
                    transform -rotate-0.5
                    relative
                    overflow-hidden
                  "
                >
                  {/* Reflejo blanco sutil */}
                  <div
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 40%, transparent 70%)",
                      mixBlendMode: "screen",
                      transform: "translate(-10%, -10%) skew(-10deg, -5deg)",
                      filter: "blur(2px)",
                      zIndex: 10,
                    }}
                  ></div>

                  <div className="page-content w-full h-full relative z-20"></div>
                </div>
              )
            )}

            <div
              className="
              w-full h-full flex items-center justify-center
              bg-gradient-to-l from-purple-500 via-purple-700 to-purple-950
              shadow-lg
              relative
              "
            >
              <img
                src="/logo_full.png"
                alt="Logo"
                className="w-1/2 h-1/2 object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            </div>

            <div className="w-full h-full flex items-center justify-center bg-[#8F959F]">
              <div className="page-content w-full h-full">
                {coverImageUrl ? (
                  <img
                    src={coverImageUrl}
                    alt={currentAlbum.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#8F959F] flex items-center justify-center">
                    <span className="text-gray-400">Sin portada</span>
                  </div>
                )}
              </div>
            </div>
          </HTMLFlipBook>
        </div>

        <div className="container text-white mt-4 mb-4">
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prevButtonClick}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded"
            >
              Página anterior
            </button>
            <span>
              {page} de {totalPages}
            </span>
            <button
              type="button"
              onClick={nextButtonClick}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded"
            >
              Siguiente página
            </button>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-900 absolute top-2 right-2 z-10"
          aria-label="Cerrar modal"
        >
          ✖
        </button>
      </div>
    </div>
  );
}
