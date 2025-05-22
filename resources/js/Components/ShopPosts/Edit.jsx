import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const Edit = ({ post, onClose }) => {
  const { data, setData, processing, errors } = useForm({
    precio: post.precio || '',
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    router.put(route('shop-posts.update', post.id), data, {
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

        <h2 className="text-white text-xl font-bold mb-6">Editar Precio</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="precio" className="block text-white font-semibold mb-1">
              Precio (€)
            </label>
            <input
              id="precio"
              type="number"
              step="0.01"
              min="0"
              value={data.precio}
              onChange={e => setData('precio', e.target.value)}
              className="w-full rounded px-3 py-2 border border-gray-600 bg-[#272729] text-white focus:outline-none focus:ring-2 focus:ring-[#a32bff]"
              required
            />
            {errors.precio && <p className="text-red-500 mt-1">{errors.precio}</p>}
          </div>

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
