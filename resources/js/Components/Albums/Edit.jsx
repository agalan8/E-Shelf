import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import ImageInput from '@/Components/ImageInput';
import { useToast } from '@/contexts/ToastProvider';

const Edit = ({ album, onClose }) => {
  const { data, setData, post, processing, errors } = useForm({
    nombre: album.nombre || '',
    descripcion: album.descripcion || '',
    portada: null,
    eliminar_portada: false,
  });

  const [isVisible, setIsVisible] = useState(false);
  const [liveErrors, setLiveErrors] = useState({});
  const { showToast } = useToast();

  useEffect(() => {
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

  const validateField = (name, value) => {
    let error = '';
    if (name === 'nombre') {
      if (!value.trim()) error = 'El nombre es obligatorio.';
      else if (value.length > 255) error = 'El nombre no puede superar 255 caracteres.';
    }
    if (name === 'descripcion') {
      if (value.length > 255) error = 'La descripción no puede superar 255 caracteres.';
    }
    setLiveErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validatePortada = (file) => {
    let error = '';
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        error = 'Formato de imagen no permitido.';
      } else if (file.size > 20480 * 1024) {
        error = 'La imagen no puede superar 20MB.';
      }
    }
    setLiveErrors((prev) => ({ ...prev, portada: error }));
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
      onSuccess: () => {
        showToast("¡Álbum actualizado con éxito!", "success");
        handleClose();
      },
    });
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-[#36393F] rounded-lg shadow-lg w-11/12 max-w-4xl p-4 sm:p-10 relative transform transition-all duration-300
          ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-5'}
          max-h-[95vh] overflow-y-auto
        `}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-red-500"
          aria-label="Cerrar"
          type="button"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-white text-2xl font-bold mb-8">Editar Álbum</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="nombre" className="block text-white font-semibold mb-2">
              Nombre del Álbum
            </label>
            <input
              id="nombre"
              type="text"
              value={data.nombre}
              onChange={(e) => {
                setData('nombre', e.target.value);
                validateField('nombre', e.target.value);
              }}
              className="w-full rounded px-4 py-3 border border-gray-600 bg-[#272729] text-white focus:outline-none focus:ring-2 focus:ring-[#a32bff]"
              required
            />
            <div className="min-h-[24px]">
              {(liveErrors.nombre || errors.nombre) && (
                <p className="text-red-500 mt-2">{liveErrors.nombre || errors.nombre}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-white font-semibold mb-2">
              Descripción
            </label>
            <textarea
              id="descripcion"
              value={data.descripcion}
              onChange={(e) => {
                setData('descripcion', e.target.value);
                validateField('descripcion', e.target.value);
              }}
              rows={5}
              className="w-full resize-none rounded px-4 py-3 border border-gray-600 bg-[#272729] text-white focus:outline-none focus:ring-2 focus:ring-[#a32bff]"
              required
            />
            <div className="min-h-[24px]">
              {(liveErrors.descripcion || errors.descripcion) && (
                <p className="text-red-500 mt-2">{liveErrors.descripcion || errors.descripcion}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center flex-col items-center">
            <ImageInput
              name="portada"
              label="Imagen de Portada"
              onChange={(file) => {
                setData('portada', file);
                if (file) setData('eliminar_portada', false);
                validatePortada(file);
              }}
              initialImage={album.cover_image?.path_medium || null}
              onDelete={eliminarPortada}
              previewClassName="w-[300px] h-[134px] sm:w-[500px] sm:h-[223px] object-cover rounded-md"
            />
            <div className="min-h-[24px]">
              {(liveErrors.portada || errors.portada) && (
                <p className="text-red-500 mt-2 text-center">{liveErrors.portada || errors.portada}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="px-8 py-3 bg-[#a32bff] hover:bg-[#9326E6] focus:bg-[#9326E6] text-white rounded transition"
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
