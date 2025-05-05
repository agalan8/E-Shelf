import React, { useState } from 'react';
import { router } from '@inertiajs/react';  // Importamos router para enviar la solicitud
import ImageInput from '@/Components/ImageInput'; // Importa el componente ImageInput

const Edit = ({ album, onClose }) => {
  // Inicializamos los estados del formulario con los valores del álbum actual
  const [nombre, setNombre] = useState(album.nombre);
  const [descripcion, setDescripcion] = useState(album.descripcion);
  const [imageFile, setImageFile] = useState(null); // Estado para manejar la nueva imagen

  // Maneja el cambio en los campos de texto (nombre y descripción)
  const handleChangeNombre = (e) => {
    setNombre(e.target.value);
  };

  const handleChangeDescripcion = (e) => {
    setDescripcion(e.target.value);
  };

  // Maneja el cambio de imagen
  const handleImageChange = (file) => {
    setImageFile(file);  // Actualiza el estado con el archivo seleccionado
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Añadir los datos del formulario
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);

    // Si se sube una nueva imagen, se añade al FormData
    if (imageFile) {
      formData.append('portada', imageFile);
    }

    formData.append('_method', 'PUT'); // Si es una actualización, añadimos el método PUT

    const albumId = album.id;

    console.log(albumId);
    // Enviar el formulario usando Inertia.js y FormData
    router.post(route('albums.update', albumId), formData, {
      onSuccess: () => onClose(),
      preserveScroll: true,  // Cerrar el modal al éxito
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
        <h3 className="text-xl font-semibold mb-4">Editar Álbum</h3>

        {/* Formulario para editar el álbum */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">
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
            <label className="block text-sm font-medium text-gray-700" htmlFor="descripcion">
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
              initialImage={album.portada ? `https://ik.imagekit.io/eshelf/${album.portada}` : null}  // Mostrar la imagen actual
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
