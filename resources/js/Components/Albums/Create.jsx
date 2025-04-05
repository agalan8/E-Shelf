import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

const Create = ({ onClose }) => {
  const { data, setData, post, processing, reset } = useForm({
    nombre: '',
    descripcion: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('albums.store'), {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Crear Álbum</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre del Álbum</label>
            <input
              type="text"
              value={data.nombre}
              onChange={(e) => setData('nombre', e.target.value)}
              required
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Descripción (opcional)</label>
            <textarea
              value={data.descripcion}
              onChange={(e) => setData('descripcion', e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">
              Cancelar
            </button>
            <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-500 text-white rounded-md">
              {processing ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
