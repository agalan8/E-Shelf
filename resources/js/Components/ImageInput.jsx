import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/solid';

const ImageInput = ({ name, label, onChange, onDelete, initialImage, previewClassName = '' }) => {
    const [imagePreview, setImagePreview] = useState(initialImage);
    const fileInputRef = useRef();

    useEffect(() => {
        if (!imagePreview && initialImage) {
            setImagePreview(initialImage);
        }
    }, [initialImage]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            onChange(file);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };

    const handleDelete = () => {
        setImagePreview(null);
        onChange(null);
        if (onDelete) onDelete();
    };

    return (
        <div className="image-input space-y-2">
            {label && <label className="block font-medium text-base text-white">{label}</label>}

            <div className="relative inline-block">
                <div
                    className={`image-preview ${previewClassName} ${!imagePreview ? 'bg-[#2A2C32]' : ''}`}
                    style={{ height: previewClassName ? undefined : '145px', width: previewClassName ? undefined : '145px' }}
                >
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className={previewClassName}
                        />
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    name={name}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />

                <button
                    type="button"
                    onClick={triggerFileSelect}
                    className="absolute top-2 right-2 bg-white hover:bg-gray-100 rounded-full shadow-lg p-2 transition"
                    title="Subir imagen"
                >
                    <ArrowUpTrayIcon className="h-7 w-7 text-gray-800" />
                </button>

                {imagePreview && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="absolute bottom-2 right-2 bg-red-500 hover:bg-red-600 rounded-full shadow-lg p-2 transition"
                        title="Eliminar imagen"
                    >
                        <TrashIcon className="h-7 w-7 text-white" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ImageInput;
