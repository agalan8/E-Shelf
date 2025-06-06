import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import ImageInput from '@/Components/ImageInput';

export default function EditCommunity({ community, onClose }) {
  const { data, setData, post, processing, errors } = useForm({
    nombre: community.nombre || '',
    descripcion: community.descripcion || '',
    visibilidad: community.visibilidad || 'publico',
    profile_image: null,
    background_image: null,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const eliminarImagenPerfil = () => {
    if (window.confirm('¿Estás seguro que quieres eliminar la imagen de perfil?')) {
      router.delete(route('communities.images.destroy', { community: community.id, imageType: 'profile_image' }), {
        preserveScroll: true,
        onSuccess: () => {
          setData('profile_image', null);
        },
      });
    }
  };

  const eliminarImagenFondo = () => {
    if (window.confirm('¿Estás seguro que quieres eliminar la imagen de fondo?')) {
      router.delete(route('communities.images.destroy', { community: community.id, imageType: 'background_image' }), {
        preserveScroll: true,
        onSuccess: () => {
          setData('background_image', null);
        },
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('nombre', data.nombre);
    formData.append('descripcion', data.descripcion);
    formData.append('visibilidad', data.visibilidad);

    if (data.profile_image) formData.append('profile_image', data.profile_image);
    if (data.background_image) formData.append('background_image', data.background_image);

    formData.append('_method', 'PUT');

    router.post(route('communities.update', community.id), formData, {
      preserveScroll: true,
      onSuccess: () => handleClose(),
    });
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  // Cierra modal al hacer clic en el overlay
  const handleOverlayClick = () => {
    handleClose();
  };

  // Evita que el clic dentro del modal cierre el modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleOverlayClick} // clic en overlay cierra modal
    >
      <div
        className={`bg-[#36393F] rounded-lg shadow-lg w-11/12 max-w-3xl p-6 relative transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-5'
        }`}
        onClick={handleModalClick} // evita cerrar modal al hacer clic dentro
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-red-500"
          aria-label="Cerrar"
          type="button"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-white text-xl font-bold mb-4">Editar Comunidad</h2>

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#36393F] p-4 rounded">
          <div>
            <label htmlFor="nombre" className="block text-white font-semibold mb-1">
              Nombre
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

          <div>
            <label className="block text-white font-semibold mb-1">Visibilidad</label>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="visibilidad"
                  value="publico"
                  checked={data.visibilidad === 'publico'}
                  onChange={e => setData('visibilidad', e.target.value)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span className="text-white">Público</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="visibilidad"
                  value="privado"
                  checked={data.visibilidad === 'privado'}
                  onChange={e => setData('visibilidad', e.target.value)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span className="text-white">Privado</span>
              </label>
            </div>
            {errors.visibilidad && <p className="text-red-500 mt-1">{errors.visibilidad}</p>}
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <ImageInput
                name="profile_image"
                label="Imagen de perfil"
                onChange={file => setData('profile_image', file)}
                initialImage={community.profile_image?.path_small || null}
                previewClassName="rounded-full w-[145px] h-[145px] object-cover"
                onDelete={eliminarImagenPerfil}
              />
              {errors.profile_image && <p className="text-red-500">{errors.profile_image}</p>}
            </div>

            <div className="flex-1 min-w-[200px]">
              <ImageInput
                name="background_image"
                label="Imagen de fondo"
                onChange={file => setData('background_image', file)}
                initialImage={community.background_image?.path_medium || null}
                previewClassName="w-[325px] h-[145px] object-cover rounded-md"
                onDelete={eliminarImagenFondo}
              />
              {errors.background_image && <p className="text-red-500">{errors.background_image}</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="bg-[#a32bff] hover:bg-[#9326E6] focus:bg-[#9326E6] text-white px-6 py-2 rounded transition"
            >
              {processing ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
