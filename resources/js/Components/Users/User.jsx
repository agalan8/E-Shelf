import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react'; // Asegúrate de importar Link
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserMinus, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import Image from '@/Components/Image'; // Asegúrate de importar el componente de imagen

export default function User({ user }) {
  const { auth } = usePage().props; // Obtener el usuario autenticado desde Inertia
  const [following, setFollowing] = useState(auth.user?.following?.some(f => f.id === user.id)); // Verifica si el usuario está siguiendo al autor
  const [hovering, setHovering] = useState(false); // Para manejar el estado de hover del icono

  // Función para manejar el cambio de seguir/dejar de seguir
  const handleFollowToggle = () => {
    if (!auth.user) return; // Si no hay un usuario autenticado, no hacer nada.

    if (following) {
      router.delete(`/unfollow/${user.id}`, {
        onSuccess: () => setFollowing(false),
        preserveScroll: true
      });
    } else {
      router.post('/follow', { followed_user_id: user.id }, {
        onSuccess: () => setFollowing(true),
        preserveScroll: true
      });
    }
  };

  // Función para renderizar el icono de seguir o dejar de seguir
  const renderFollowIcon = () => {
    if (!auth.user || auth.user.id === user.id) return null; // Si el usuario autenticado es el mismo que el autor de la publicación no renderiza el ícono

    let icon = faUserPlus;
    let color = 'text-blue-500';
    let title = 'Seguir';

    if (following) {
      icon = hovering ? faUserMinus : faUserCheck;
      color = hovering ? 'text-red-500' : 'text-green-500';
      title = hovering ? 'Dejar de seguir' : 'Siguiendo';
    }

    return (
      <button
        onClick={handleFollowToggle}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={`text-2xl cursor-pointer transition-colors duration-200 ${color}`}
        title={title}
      >
        <FontAwesomeIcon icon={icon} />
      </button>
    );
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white cursor-pointer">
      <div className="relative">
        {/* Imagen de fondo */}
        <Image
          className="w-full h-32 object-cover"
          path={`${user.background_image}?t=${new Date().getTime()}`}
          alt="Background"
        />
        {/* Imagen de perfil */}
        <div className="absolute top-16 left-4">
          <Image
            className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            path={`${user.profile_image}?t=${new Date().getTime()}`}
            alt="Profile Image"
          />
        </div>
      </div>
      {/* Nombre del usuario y botón de seguir */}
      <div className="pt-10 pl-5 pb-5 flex items-center">
        <Link href={route('users.show', { user: user.id })}>
          <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
        </Link>
        {/* Coloca el icono de seguir al lado de la imagen de perfil */}
        <div className="ml-8">
          {renderFollowIcon()}
        </div>
      </div>
    </div>
  );
}
