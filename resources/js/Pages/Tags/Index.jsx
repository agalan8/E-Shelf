import { Link, Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function TagIndex() {
  const { tags } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // animación de opacidad
  const [editingTag, setEditingTag] = useState(null);
  const [nombre, setNombre] = useState('');
  const [search, setSearch] = useState('');
  const [searchField, setSearchField] = useState('nombre');
  const [sortField, setSortField] = useState('nombre');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    if (showModal) {
      setIsVisible(true);
    }
  }, [showModal]);

  const openModal = (tag = null) => {
    setEditingTag(tag);
    setNombre(tag ? tag.nombre : '');
    setShowModal(true);
  };

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowModal(false);
      setEditingTag(null);
      setNombre('');
    }, 300); // igual a la transición
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { nombre };

    if (editingTag) {
      router.put(route('tags.update', editingTag.id), formData, {
        onSuccess: () => closeModal(),
      });
    } else {
      router.post(route('tags.store'), formData, {
        onSuccess: () => closeModal(),
      });
    }
  };

  const deleteTag = (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta etiqueta?")) {
      router.delete(route('tags.destroy', id));
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredTags = tags
    .filter((tag) =>
      tag.nombre.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const result = a.nombre.localeCompare(b.nombre);
      return sortDirection === 'asc' ? result : -result;
    });

  return (
    <AuthenticatedLayout
      header={<h2 className="font-semibold leading-tight text-white">Gestión de Etiquetas</h2>}
    >
      <Head title="Gestión de Etiquetas" />

      <div className="max-w-4xl mx-auto my-5 p-6 bg-gray-900 rounded-lg shadow-lg text-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Lista de Etiquetas</h1>
          <button
            onClick={() => openModal()}
            className="px-5 py-2 rounded-md bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-md transition flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Crear Etiqueta</span>
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full px-4 py-3 rounded-md bg-gray-800 text-gray-200 placeholder-gray-500 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>

        <table className="w-full border-collapse text-gray-200 shadow-lg rounded-md overflow-hidden">
          <thead>
            <tr className="bg-gray-800 border-b border-purple-600">
              <th
                className="border border-purple-700 p-3 cursor-pointer select-none"
                onClick={() => handleSort('nombre')}
              >
                Nombre {sortField === 'nombre' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="border border-purple-700 p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTags.map((tag) => (
              <tr key={tag.id} className="text-center hover:bg-gray-800 border-b border-purple-700 transition">
                <td className="border border-purple-700 p-3">{tag.nombre}</td>
                <td className="border border-purple-700 p-3 space-x-2">
                  <button
                    onClick={() => openModal(tag)}
                    className="inline-flex items-center justify-center p-2 text-white bg-yellow-600 hover:bg-yellow-700 rounded transition text-lg"
                    title="Editar"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => deleteTag(tag.id)}
                    className="inline-flex items-center justify-center p-2 text-white bg-red-700 hover:bg-red-800 rounded transition text-lg"
                    title="Eliminar"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(showModal || isVisible) && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="bg-gray-900 rounded-lg shadow-lg w-96 p-6 ring-2 ring-purple-600">
            <h2 className="text-2xl font-bold mb-5 text-white text-center tracking-wide">
              {editingTag ? 'Editar Etiqueta' : 'Crear Etiqueta'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full rounded-md bg-gray-800 border border-purple-600 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white font-semibold shadow-md transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-md transition"
                >
                  {editingTag ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
