import DeleteUserForm from '@/Pages/Profile/Partials/DeleteUserForm';
import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from '@/Pages/Profile/Partials/UpdateProfileInformationForm';
import UpdateProfileImagesForm from '@/Pages/Profile/Partials/UpdateProfileImagesForm';
import SubNavLink from '@/Components/SubNavLink';
import { PencilIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

export default function Edit({ isOpen, onClose, mustVerifyEmail, status, socials }) {
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [activeTab, setActiveTab] = useState('perfil');

  useEffect(() => {
    let timer;

    if (isOpen) {
      setShouldRender(true);
      timer = setTimeout(() => setVisible(true), 10); // animar apertura
    } else if (shouldRender) {
      setVisible(false); // animar cierre
      timer = setTimeout(() => {
        setShouldRender(false); // desmontar modal
        if (onClose) onClose();
      }, 300); // duración de la animación
    }

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Cuando el usuario pulsa fuera o en la X, animamos la salida y avisamos al padre después
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      setShouldRender(false);
      if (onClose) onClose();
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`
          w-full max-w-5xl bg-[#36393F] rounded-2xl shadow-xl flex flex-col overflow-hidden transform transition-all duration-300
          ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          sm:rounded-2xl sm:h-[90vh] sm:max-w-5xl
          h-screen max-w-full
        `}
        style={{ maxHeight: '100dvh' }} // Para soportar altura real en móviles modernos
      >
        {/* Barra superior */}
        <div className="w-full bg-[#292B2F] text-white flex items-center justify-between p-4 sm:p-4 p-2">
          <button
            onClick={handleClose}
            className="text-white text-2xl font-bold"
            aria-label="Cerrar"
          >
            ×
          </button>
          <h3 className="text-lg font-semibold mx-auto">Opciones de Perfil</h3>
        </div>

        {/* Contenido */}
        <div className="flex flex-row w-full flex-1 sm:flex-row flex-col
          sm:overflow-hidden overflow-y-auto">
          {/* Navegación */}
          <div className="sm:w-1/4 w-full bg-[#2F3136] text-white sm:p-6 p-3 space-y-4 sm:pt-5 pt-3 flex-shrink-0">
            <h3 className="text-base font-semibold">Editar perfil</h3>
            <div className="flex sm:flex-col flex-row gap-2 text-sm font-medium">
              <SubNavLink
                href="#update-images"
                active={activeTab === 'perfil'}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('perfil');
                }}
                className="flex items-center"
              >
                <PencilIcon className="h-6 w-6" />
                <span className="ml-2">Perfil</span>
              </SubNavLink>

              <SubNavLink
                href="#update-profile-info"
                active={activeTab === 'seguridad'}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('seguridad');
                }}
                className="flex items-center"
              >
                <LockClosedIcon className="h-6 w-6" />
                <span className="ml-2">Privacidad y Seguridad</span>
              </SubNavLink>
            </div>
          </div>

          {/* Formularios */}
          <div className="sm:w-3/4 w-full sm:p-6 p-3 sm:pt-5 pt-3 sm:pb-8 pb-3 flex flex-col
            sm:overflow-y-auto overflow-visible sm:h-[calc(90vh-64px)] h-auto">
            <div className="space-y-6 flex-grow">
              {activeTab === 'perfil' && (
                <>
                  <div id="update-images" className="w-full overflow-hidden">
                    <UpdateProfileImagesForm className="w-full" />
                  </div>
                  <div id="update-profile-info" className="w-full overflow-hidden">
                    <UpdateProfileInformationForm
                      mustVerifyEmail={mustVerifyEmail}
                      status={status}
                      socials={socials}
                      className="w-full"
                    />
                  </div>
                </>
              )}
              {activeTab === 'seguridad' && (
                <>
                  <div id="update-password" className="w-full overflow-hidden">
                    <UpdatePasswordForm className="w-full" />
                  </div>
                  <div id="delete-account" className="w-full overflow-hidden">
                    <DeleteUserForm className="w-full" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
