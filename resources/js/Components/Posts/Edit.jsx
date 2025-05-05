import { router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import Image from '@/Components/Image';

const Edit = ({ post, onClose, tags }) => {
  // Asegurando que nunca haya valores undefined
  const [titulo, setTitulo] = useState(post?.titulo || '');
  const [descripcion, setDescripcion] = useState(post?.descripcion || '');
  const [localizacion, setLocalizacion] = useState(post?.photo.localizacion || '');
  const [selectedTags, setSelectedTags] = useState(post?.tags || []);
  const [imageFile, setImageFile] = useState(null); // Estado para manejar la nueva imagen
  const [imageUploaded, setImageUploaded] = useState(false); // Estado para verificar si se subió una nueva imagen

  const [searchTerm, setSearchTerm] = useState(''); // Estado para la búsqueda de tags
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estado para manejar el dropdown de tags

  useEffect(() => {
    // Reset form fields if post data changes
    setTitulo(post?.titulo || '');
    setDescripcion(post?.descripcion || '');
    setLocalizacion(post?.photo.localizacion || '');
    setSelectedTags(post?.tags || []);
    setImageUploaded(false);
    setImageFile(null);
  }, [post]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImageUploaded(true); // Marcar que se subió una nueva imagen
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

    // Añadir los datos del formulario
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('localizacion', localizacion);

    // Añadir la nueva imagen si se subió una
    if (imageFile) {
      formData.append('imagen', imageFile);
    }

    // Añadir las etiquetas seleccionadas
    selectedTags.forEach(tag => {
      formData.append('tags[]', tag.id);
    });

    formData.append('_method', 'PUT');

    const postId = post.id;

    // Enviar la solicitud PUT usando Inertia.js
    router.post(route('posts.update', postId), formData, {
        preserveScroll: true,
    });

    // Cerrar el modal después de guardar
    onClose();
  };

  // Asegurando que `tags` no sea undefined
  const tagsList = tags || []; // Si tags no está disponible, usar un array vacío

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="text-red-500 hover:text-red-700 absolute top-2 right-2">X</button>

        <h2 className="text-2xl font-semibold mb-4">Editar Publicación</h2>

        {/* Imagen fuera del formulario */}
        <div className="mb-4">
          <label className="block text-lg font-semibold">Imagen</label>
          {imageUploaded ? (
            <div className="flex items-center justify-between">
              <img src={URL.createObjectURL(imageFile)} alt="Imagen subida" className="w-32 h-32 object-cover rounded-lg mb-4" />
              <button onClick={() => setImageUploaded(false)} className="text-red-500 hover:text-red-700">Eliminar Imagen</button>
            </div>
          ) : (
            <div>
              <Image
                path={`${post?.photo?.url}?t=${new Date().getTime()}`}
                alt="Imagen actual"
                className="w-32 h-32 object-cover rounded-lg mb-4"
              />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-2 p-2 border rounded" />
            </div>
          )}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="titulo" className="block text-lg font-semibold">Título</label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-lg font-semibold">Descripción</label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="localizacion" className="block text-lg font-semibold">Localización</label>
            <input
              type="text"
              id="localizacion"
              value={localizacion}
              onChange={(e) => setLocalizacion(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold">Etiquetas</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTags.map(tag => (
                <div key={tag.id} className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-2">
                  <span>{tag.nombre}</span>
                  <button type="button" onClick={() => handleTagRemove(tag.id)} className="text-red-500">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Dropdown de selección de tags con búsqueda */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full mt-2 p-2 border rounded bg-white text-left"
            >
              Seleccionar etiqueta
            </button>

            {isDropdownOpen && (
              <div className="absolute w-full mt-1 border rounded bg-white shadow-md z-10 max-h-40 overflow-y-auto">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border-b"
                />
                {tagsList.filter(tag => tag.nombre.toLowerCase().includes(searchTerm.toLowerCase())).map(tag => (
                  <div
                    key={tag.id}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                    onClick={() => handleTagSelect(tag)}
                  >
                    {tag.nombre}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;
