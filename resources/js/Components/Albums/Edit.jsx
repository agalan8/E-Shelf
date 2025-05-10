import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import ImageInput from '@/Components/ImageInput';

const Edit = ({ album, onClose }) => {
  const [nombre, setNombre] = useState(album.nombre);
  const [descripcion, setDescripcion] = useState(album.descripcion);
  const [imageFile, setImageFile] = useState(null);
  const [coverImageDeleted, setCoverImageDeleted] = useState(false);

  const handleChangeNombre = (e) => setNombre(e.target.value);
  const handleChangeDescripcion = (e) => setDescripcion(e.target.value);

  const handleImageChange = (file) => {
    setImageFile(file);
    if (file !== null) {
      setCoverImageDeleted(false); // si se selecciona nueva imagen, anular eliminación
    }
  };

  const eliminarPortada = () => {
    router.delete(route('albums.eliminar-portada', album.id), {
      preserveScroll: true,
      onSuccess: () => setCoverImageDeleted(true),
    });
    setImageFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);

    if (imageFile) {
      formData.append('portada', imageFile);
    } else if (coverImageDeleted) {
      formData.append('eliminar_portada', true);
    }

    formData.append('_method', 'PUT');

    router.post(route('albums.update', album.id), formData, {
      onSuccess: () => onClose(),
      preserveScroll: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
        <h3 className="text-xl font-semibold mb-4">Editar Álbum</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre del Álbum
            </label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              value={nombre}
              onChange={handleChangeNombre}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              name="descripcion"
              id="descripcion"
              value={descripcion}
              onChange={handleChangeDescripcion}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <ImageInput
              name="portada"
              label="Imagen de Portada"
              onChange={handleImageChange}
              initialImage={album.cover_image?.path_medium || null}
              onDelete={eliminarPortada}
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;
