import React, { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import UserCard from '@/Components/Users/UserCard';

const FollowersModal = ({ isOpen, onClose, followers }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleClose} // cerrar al clic en el backdrop
      className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()} // evitar cierre si clic dentro del modal
        className={`bg-[#36393F] rounded-lg shadow-lg w-full max-w-lg p-6 relative transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-5'
        }`}
        style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-red-500"
          aria-label="Cerrar"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-white text-xl font-bold mb-4 flex-shrink-0">Seguidores</h2>

        {followers.length === 0 ? (
          <p className="text-center text-white flex-grow flex items-center justify-center">
            Este usuario no tiene seguidores.
          </p>
        ) : (
          <div
            className="flex flex-col gap-4 overflow-y-auto pr-1"
            style={{ flexGrow: 1 }}
          >
            {followers.map((follower) => (
              <UserCard key={follower.id} user={follower} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowersModal;
