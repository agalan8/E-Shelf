import { router } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import Image from '../Image';

const Edit = ({ post, onClose, tags }) => {
  const [titulo, setTitulo] = useState(post?.titulo || '');
  const [descripcion, setDescripcion] = useState(post?.descripcion || '');
  const [localizacion, setLocalizacion] = useState(post?.image.localizacion || '');
  const [selectedTags, setSelectedTags] = useState(post?.tags || []);
  const [imageFile, setImageFile] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dropdownRef = useRef();

  useEffect(() => {
    setTitulo(post?.titulo || '');
    setDescripcion(post?.descripcion || '');
    setLocalizacion(post?.image.localizacion || '');
    setSelectedTags(post?.tags || []);
    setImageUploaded(false);
    setImageFile(null);
  }, [post]);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImageUploaded(true);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUploaded(false);
  };

  const handleTagSelect = (tag) => {
    if (!selectedTags.some(t => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tagId) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('localizacion', localizacion);
    if (imageFile) {
      formData.append('imagen', imageFile);
    }
    selectedTags.forEach(tag => {
      formData.append('tags[]', tag.id);
    });
    formData.append('_method', 'PUT');
    router.post(route('posts.update', post.id), formData, {
      preserveScroll: true,
    });
    handleClose(); // usa animación
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Coincide con la duración del fade
  };

  const tagsList = tags || [];

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 cursor-default transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`bg-[#1f1f1f] rounded-lg shadow-lg w-11/12 h-[90vh] flex overflow-hidden relative transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-5'
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-red-400 z-10"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Imagen */}
        <div className="w-4/5 flex items-center justify-center bg-[#292B2F] relative p-4">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <Image
              src={`${post?.image?.path_medium}?t=${new Date().getTime()}`}
              alt="Imagen actual"
              className="max-h-full max-w-full object-contain rounded shadow-2xl shadow-black"
            />
            <label className="flex flex-col items-center justify-center cursor-pointer p-3 mt-3 border-2 border-dashed border-gray-500 rounded-lg text-white hover:bg-white hover:bg-opacity-10">
              <ArrowUpTrayIcon className="h-6 w-6 mb-1" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <span>Subir nueva imagen</span>
            </label>
          </div>
        </div>

        {/* Formulario */}
        <div className="w-1/3 p-6 bg-[#272729] overflow-y-auto text-white">
          <h2 className="text-xl font-bold mb-4">Editar Publicación</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium">Título</label>
              <input
                type="text"
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md bg-[#1c1c1e] text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium">Descripción</label>
              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md bg-[#1c1c1e] text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="localizacion" className="block text-sm font-medium">Localización</label>
              <input
                type="text"
                id="localizacion"
                value={localizacion}
                onChange={(e) => setLocalizacion(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md bg-[#1c1c1e] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Etiquetas</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTags.map(tag => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-700 text-white rounded-full text-sm"
                  >
                    <span>{tag.nombre}</span>
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag.id)}
                      className="text-red-300 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full h-12 mt-2 px-4 text-left border rounded-md bg-[#1c1c1e] text-white"
                >
                  Seleccionar etiqueta...
                </button>

                {isDropdownOpen && (
                  <div className="absolute w-full mt-1 border rounded bg-[#1c1c1e] shadow-md z-10 max-h-60 overflow-y-auto">
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[#2a2a2a] text-white placeholder-gray-400 outline-none border-b border-gray-600 rounded-t-md"
                    />
                    {tagsList
                      .filter(tag => tag.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(tag => (
                        <div
                          key={tag.id}
                          className="cursor-pointer px-3 py-2 hover:bg-[#2f2f2f] text-sm text-white"
                          onClick={() => handleTagSelect(tag)}
                        >
                          {tag.nombre}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded text-base"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit;
