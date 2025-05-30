import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import ImageInput from '@/Components/ImageInput';

const Edit = ({ album, onClose }) => {
  const { data, setData, post, processing, errors } = useForm({
    nombre: album.nombre || '',
    descripcion: album.descripcion || '',
    portada: null,
    eliminar_portada: false,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Activar animación de aparición
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const eliminarPortada = () => {
    if (window.confirm('¿¿Estás seguro que quieres eliminar la imagen de portada?')) {
      router.delete(route('albums.eliminar-portada', album.id), {
        preserveScroll: true,
        onSuccess: () => {
          setData('portada', null);
          setData('eliminar_portada', true);
        },
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('descripcion', data.descripcion);

    if (data.portada) {
      formData.append('portada', data.portada);
    } else if (data.eliminar_portada) {
      formData.append('eliminar_portada', true);
    }

    formData.append('_method', 'PUT');

    router.post(route('albums.update', album.id), formData, {
      preserveScroll: true,
      onSuccess: () => handleClose(),
    });
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`bg-[#36393F] rounded-lg shadow-lg w-11/12 max-w-md p-6 relative transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-5'
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-red-500"
          aria-label="Cerrar"
          type="button"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-white text-xl font-bold mb-6">Editar Álbum</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-white font-semibold mb-1">
              Nombre del Álbum
            </label>
            <input
              id="nombre"
              type="text"
              value={data.nombre}
              onChange={e => setData('nombre', e.target.value)}
              className="w-full rounded px-3 py-2 border border-gray-600 bg-[#272729] text-white focus:outline-none focus:ring-2 focus:ring-[#a32bff]"
              required
            />
            {errors.nombre && <p className="text-red-500 mt-1">{errors.nombre}</p>}
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-white font-semibold mb-1">
              Descripción
            </label>
            <textarea
              id="descripcion"
              value={data.descripcion}
              onChange={e => setData('descripcion', e.target.value)}
              rows={4}
              className="w-full rounded px-3 py-2 border border-gray-600 bg-[#272729] text-white focus:outline-none focus:ring-2 focus:ring-[#a32bff]"
              required
            />
            {errors.descripcion && <p className="text-red-500 mt-1">{errors.descripcion}</p>}
          </div>

          {/* Centrar el input de imagen */}
          <div className="flex justify-center">
            <ImageInput
              name="portada"
              label="Imagen de Portada"
              onChange={file => {
                setData('portada', file);
                if (file) setData('eliminar_portada', false);
              }}
              initialImage={album.cover_image?.path_medium || null}
              onDelete={eliminarPortada}
              previewClassName="w-full max-w-[320px] h-[160px] object-cover rounded-md"
            />
          </div>
          {errors.portada && <p className="text-red-500 mt-1 text-center">{errors.portada}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="px-6 py-2 bg-[#a32bff] hover:bg-[#9326E6] focus:bg-[#9326E6] text-white rounded transition"
            >
              {processing ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;
