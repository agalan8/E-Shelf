import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('user', JSON.stringify(data.user));
        if (data.profile_image) formData.append('profile_image', data.profile_image);
        if (data.background_image) formData.append('background_image', data.background_image);

        post(route('images.update'), {
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-[#36393F]">
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

            <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                    <ImageInput
                        name="profile_image"
                        label="Imagen de perfil"
                        onChange={(file) => setData('profile_image', file)}
                        initialImage={user.profile_image ? `https://ik.imagekit.io/eshelf/${user.profile_image}?t=${new Date().getTime()}` : null}
                        previewClassName="rounded-full w-[145px] h-[145px] object-cover"
                        destroyUrl={route('images.destroy', { user: user.id, imageType: 'profile_image' })}
                    />
                    {errors.profile_image && <div className="text-red-500">{errors.profile_image}</div>}
                </div>

                <div className="flex-1 min-w-[200px]">
                    <ImageInput
                        name="background_image"
                        label="Imagen de fondo"
                        onChange={(file) => setData('background_image', file)}
                        initialImage={user.background_image ? `https://ik.imagekit.io/eshelf/${user.background_image}?t=${new Date().getTime()}` : null}
                        previewClassName="w-[325px] h-[145px] object-cover rounded-md"
                        destroyUrl={route('images.destroy', { user: user.id, imageType: 'background_image' })}
                    />
                    {errors.background_image && <div className="text-red-500">{errors.background_image}</div>}
                </div>
            </div>

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
