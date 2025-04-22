import DeleteUserForm from '@/Pages/Profile/Partials/DeleteUserForm';
import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from '@/Pages/Profile/Partials/UpdateProfileInformationForm';
import UpdateProfileImagesForm from '@/Pages/Profile/Partials/UpdateProfileImagesForm';
import SubNavLink from '@/Components/SubNavLink';
import { PencilIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

export default function Edit({ isOpen, onClose, mustVerifyEmail, status, socials }) {
    const [activeTab, setActiveTab] = useState('perfil');
    const nodeRef = useRef(null);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <CSSTransition
            in={isOpen}
            timeout={300}
            classNames="fade"
            unmountOnExit
            nodeRef={nodeRef}
        >
            {(state) => (
                <div
                    ref={nodeRef}
                    onClick={handleBackdropClick}
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300
                        ${state === 'entering' || state === 'entered' ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div
                        className={`w-full max-w-5xl h-[90vh] bg-[#36393F] rounded-2xl shadow-xl flex flex-col overflow-hidden transform transition-all duration-300
                            ${state === 'entering' || state === 'entered' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    >
                        {/* Barra superior */}
                        <div className="w-full bg-[#292B2F] text-white flex items-center justify-between p-4">
                            <button
                                onClick={onClose}
                                className="text-white text-2xl font-bold"
                                aria-label="Cerrar"
                            >
                                ×
                            </button>
                            <h3 className="text-lg font-semibold mx-auto">Opciones de Perfil</h3>
                        </div>

                        {/* Contenido */}
                        <div className="flex flex-row w-full h-full">
                            {/* Navegación */}
                            <div className="w-1/4 bg-[#2F3136] text-white p-6 space-y-4 pt-5">
                                <h3 className="text-base font-semibold">Editar perfil</h3>
                                <div className="flex flex-col gap-2 text-sm font-medium">
                                    <SubNavLink
                                        href="#update-images"
                                        active={activeTab === 'perfil'}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleTabClick('perfil');
                                        }}
                                        className="flex"
                                    >
                                        <PencilIcon className="h-6 w-6" />
                                        <span>Perfil</span>
                                    </SubNavLink>

                                    <SubNavLink
                                        href="#update-profile-info"
                                        active={activeTab === 'seguridad'}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleTabClick('seguridad');
                                        }}
                                        className="flex"
                                    >
                                        <LockClosedIcon className="h-6 w-6" />
                                        <span>Privacidad y Seguridad</span>
                                    </SubNavLink>
                                </div>
                            </div>

                            {/* Formularios */}
                            <div className="w-3/4 p-6 pt-5 pb-24 flex flex-col justify-between overflow-y-auto">
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
            )}
        </CSSTransition>
    );
}
