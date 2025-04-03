import { useState } from 'react';
import { Link, Head, usePage, router } from '@inertiajs/react';
import Show from '@/Components/Posts/Show'; // Importa el componente Show
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const MisPosts = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState(null); // Estado para almacenar la publicación seleccionada
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar la visibilidad del modal

  const handleOpenModal = (post) => {
    setSelectedPost(post); // Establecer la publicación seleccionada
    setModalOpen(true); // Abrir el modal
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Cerrar el modal
    setSelectedPost(null); // Limpiar la publicación seleccionada
  };

  return (
    <AuthenticatedLayout
                header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Crear publicación</h2>}
    >
        <Head title="Crear publicación" />
        <div className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Mis Publicaciones</h2>

        {posts.length === 0 ? (
            <p>No tienes publicaciones aún.</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
                <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
                <img
                    src={`/storage/${post.photo.url}?t=${new Date().getTime()}`}
                    alt={post.titulo}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold">{post.titulo}</h3>
                <p className="text-sm text-gray-500">{post.descripcion}</p>
                <p className="text-sm text-gray-400">{post.localizacion}</p>

                {/* Botón para abrir el modal */}
                <button
                    onClick={() => handleOpenModal(post)}
                    className="text-blue-500 mt-2"
                >
                    Ver detalles
                </button>
                </div>
            ))}
            </div>
        )}

        {/* Mostrar el modal con la publicación seleccionada */}
        {modalOpen && selectedPost && (
            <Show post={selectedPost} onClose={handleCloseModal} />
        )}
        </div>
    </AuthenticatedLayout>
  );
};

export default MisPosts;
