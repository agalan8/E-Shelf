import React from 'react';
import { Link } from '@inertiajs/react'; // Asegúrate de importar Link

export default function User({ user }) {
  return (
    <Link href={route('users.show', { user: user.id })}>
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white cursor-pointer">
        <div className="relative">
          {/* Imagen de fondo */}
          <img
            className="w-full h-32 object-cover"
            src={`/storage/${user.background_image}?t=${new Date().getTime()}`}
            alt="Background"
          />
          {/* Imagen de perfil */}
          <div className="absolute top-16 left-4">
            <img
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
              src={`/storage/${user.profile_image}?t=${new Date().getTime()}`}
              alt="Profile Image"
            />
          </div>
        </div>
        {/* Nombre del usuario alineado a la izquierda */}
        <div className="pt-10 pl-5 pb-5">
          <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
        </div>
      </div>
    </Link>
  );
}
