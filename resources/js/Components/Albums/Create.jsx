import React, { useState } from 'react';
import { router } from '@inertiajs/react';

const Create = ({ onClose, posts }) => {
  // Estado para manejar los datos del formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [step, setStep] = useState(1);

  // Función para avanzar al siguiente paso
  const handleNextStep = () => {
    if (nombre.trim()) {
      setStep(2); // Si hay un nombre, avanzamos al siguiente paso
    }
  };

  // Función para alternar la selección de un post
  const handleTogglePost = (postId) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  // Función para manejar la carga de la imagen de portada
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file); // Guardar la imagen
    setImageUploaded(true); // Marcar que la imagen se ha subido
  };

  // Función para eliminar la imagen cargada
  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUploaded(false);
  };

  // Función para enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Si hay una imagen de portada, agregarla al FormData
    if (imageFile) {
      formData.append('portada', imageFile);
    }

    // Agregar los campos de texto al FormData
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);

    // Agregar los posts seleccionados al FormData
    selectedPosts.forEach((postId) => {
      formData.append('selectedPosts[]', postId);
    });

    console.log('FormData album:', formData); // Verificar el contenido del FormData

    // Enviar el formulario utilizando el router de Inertia
    router.post(route('albums.store'), formData, {
      onFinish: () => {
        onClose(); // Cerrar el modal después de enviar el formulario
      },
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className={`bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl ${step === 2 ? 'h-[90%]' : 'w-96'}`}>
        {/* Paso 1: Información básica del álbum */}
        {step === 1 ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Crear Álbum</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nombre del Álbum</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full mt-1 p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Descripción (opcional)</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                />
              </div>

              {/* Imagen de portada */}
              {!imageUploaded ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <h1 className="text-4xl font-bold">Sube tu imagen</h1>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="mt-4"
                  />
                </div>
              ) : (
                <div>
                  <div className="flex flex-col items-center">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Imagen subida"
                      className="w-32 h-32 object-cover rounded-lg mb-4"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="text-red-500 hover:text-red-700 mt-2"
                    >
                      Eliminar Imagen
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="button" // Aquí cambiamos el tipo de "submit" a "button"
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Siguiente
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* Paso 2: Selección de posts */}
            <h2 className="text-xl font-semibold mb-4">Seleccionar Posts</h2>
            <div className="max-h-[80%] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {posts.length === 0 ? (
                <p>No tienes posts disponibles.</p>
              ) : (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className={`relative cursor-pointer rounded-md transition-all transform ${
                      selectedPosts.includes(post.id)
                        ? 'border-4 border-blue-500 shadow-lg bg-blue-100' // Estilo cuando está seleccionado
                        : 'bg-white'
                    }`}
                    onClick={() => handleTogglePost(post.id)} // Alternar selección de post
                  >
                    <img
                      src={`${post.photo.url}`}
                      alt={post.titulo}
                      className="object-cover w-full h-64 rounded-md"
                    />
                    <div className="absolute bottom-0 left-0 p-2 bg-black bg-opacity-50 text-white w-full text-center">
                      {post.titulo}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Atrás
              </button>
              <button
                type="submit"
                onClick={handleSubmit} // Este es el botón que envía el formulario
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Crear Álbum
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Create;
