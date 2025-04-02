import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import ImageInput from '@/Components/ImageInput';
import { Transition } from '@headlessui/react';


const ImageUploadForm = () => {
    const { flash, auth } = usePage().props; // Extrae los mensajes flash y la autenticación
    const user = auth.user;
    const successMessage = flash?.success; // Captura el mensaje de éxito

    console.log('Mensaje de exito', successMessage);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        user,
        profile_image: null,
        background_image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('user', JSON.stringify(data.user));
        if (data.profile_image) formData.append('profile_image', data.profile_image);
        if (data.background_image) formData.append('background_image', data.background_image);

        post(route('images.update'), {
            preserveScroll: true, // Mantiene el scroll después del envío
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4">

                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                >
                    <p className="text-sm text-green-600">
                        Imágenes guardadas exitósamente.
                    </p>
                </Transition>
            </div>

            <ImageInput
                name="profile_image"
                label="Profile Image"
                onChange={(file) => setData('profile_image', file)}
                initialImage={user.profile_image ? `/storage/${user.profile_image}?t=${new Date().getTime()})` : null}
            />
            {errors.profile_image && <div className="text-red-500">{errors.profile_image}</div>}

            <ImageInput
                name="background_image"
                label="Background Image"
                onChange={(file) => setData('background_image', file)}
                initialImage={user.background_image ? `/storage/${user.background_image}?t=${new Date().getTime()})` : null}
            />
            {errors.background_image && <div className="text-red-500">{errors.background_image}</div>}

            <button type="submit" disabled={processing} className="bg-blue-500 text-white px-4 py-2 rounded">
                {processing ? 'Uploading...' : 'Upload Images'}
            </button>
        </form>
    );
};

export default ImageUploadForm;
