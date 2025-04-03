import { Link } from '@inertiajs/react';

const MisPosts = ({ posts }) => {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Mis Publicaciones</h2>

      {/* Verificar si el usuario tiene publicaciones */}
      {posts.length === 0 ? (
        <p>No tienes publicaciones aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Mostrar cada publicación */}
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
              <img
                src={post.photo ? post.photo.url : '/default-image.jpg'}
                alt={post.titulo}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold">{post.titulo}</h3>
              <p className="text-sm text-gray-500">{post.descripcion}</p>
              <p className="text-sm text-gray-400">{post.localizacion}</p>

              {/* Enlace para ver más detalles o editar el post */}
              <Link
                href={`/posts/${post.id}`}
                className="text-blue-500 mt-2 block"
              >
                Ver detalles
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisPosts;
