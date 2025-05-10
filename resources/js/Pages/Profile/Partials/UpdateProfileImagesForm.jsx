import React, { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import ImageInput from '@/Components/ImageInput';
import { Transition } from '@headlessui/react';

const UpdateImagesProfileForm = () => {
    const { flash, auth } = usePage().props;
    const user = auth.user;
    const successMessage = flash?.success;

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        user,
        profile_image: null,
        background_image: null,
    });

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('user', JSON.stringify(data.user));

        // Si hay una imagen de perfil, añádela al FormData
        if (data.profile_image) formData.append('profile_image', data.profile_image);

        // Si hay una imagen de fondo, añádela al FormData
        if (data.background_image) formData.append('background_image', data.background_image);

        // Enviar la solicitud POST a la ruta de actualización de imágenes
        post(route('images.update'), {
            preserveScroll: true,
        });
    };

    console.log(user);

    // Función para eliminar la imagen
    const handleDeleteImage = (imageType) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {

            // Usamos Inertia para hacer la solicitud DELETE
            router.delete(route('images.destroy',{ user: user.id, imageType}), {
                preserveScroll: true,
                onSuccess: () => {
                    // Si la eliminación es exitosa, actualizamos el estado para reflejarlo
                    if (imageType === 'profile_image') {
                        setData('profile_image', null);
                    } else if (imageType === 'background_image') {
                        setData('background_image', null);
                    }
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-[#36393F] p-4">
            <div className="flex items-center gap-4">
                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                >
                    <p className="text-sm text-green-600">
                        {successMessage || 'Imágenes guardadas exitósamente.'}
                    </p>
                </Transition>
            </div>

            <div className="flex flex-wrap gap-4">
                {/* Imagen de perfil */}
                <div className="flex-1 min-w-[200px]">
                    <ImageInput
                        name="profile_image"
                        label="Imagen de perfil"
                        onChange={(file) => setData('profile_image', file)} // Actualiza el estado con la imagen seleccionada
                        initialImage={user.profile_image?.path_small || null}
                        previewClassName="rounded-full w-[145px] h-[145px] object-cover"
                        onDelete={() => handleDeleteImage('profile_image')} // Llama a la función handleDeleteImage para eliminar la imagen
                    />
                    {errors.profile_image && <div className="text-red-500">{errors.profile_image}</div>}
                </div>

                {/* Imagen de fondo */}
                <div className="flex-1 min-w-[200px]">
                    <ImageInput
                        name="background_image"
                        label="Imagen de fondo"
                        onChange={(file) => setData('background_image', file)} // Actualiza el estado con la imagen seleccionada
                        initialImage={user.background_image?.path_medium || null}
                        previewClassName="w-[325px] h-[145px] object-cover rounded-md"
                        onDelete={() => handleDeleteImage('background_image')} // Llama a la función handleDeleteImage para eliminar la imagen
                    />
                    {errors.background_image && <div className="text-red-500">{errors.background_image}</div>}
                </div>
            </div>

            {/* Botón para enviar el formulario */}
            <button
                type="submit"
                disabled={processing}
                className="bg-[#a32bff] hover:bg-[#9326E6] focus:bg-[#9326E6] text-white px-4 py-2 rounded transition"
            >
                {processing ? 'Subiendo...' : 'Subir imágenes'}
            </button>
        </form>
    );
};

export default UpdateImagesProfileForm;
