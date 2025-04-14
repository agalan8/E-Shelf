import DeleteUserForm from '@/Pages/Profile/Partials/DeleteUserForm';
import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from '@/Pages/Profile/Partials/UpdateProfileInformationForm';
import UpdateProfileImagesForm from '@/Pages/Profile/Partials/UpdateProfileImagesForm';
import { usePage } from '@inertiajs/react';


export default function Edits({ isOpen, onClose, mustVerifyEmail, status, socials }) {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleBackdropClick}
        >
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 relative overflow-y-auto max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
                    aria-label="Cerrar"
                >
                    ×
                </button>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">Editar Perfil</h3>

                <div className="space-y-6">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-6">
                        <UpdateProfileImagesForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-6">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            socials={socials}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-6">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-6">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
