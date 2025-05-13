import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Image from "../Image";

const Create = ({ onClose, posts }) => {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [selectedPosts, setSelectedPosts] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [step, setStep] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 10);
    }, []);

    const handleNextStep = () => {
        if (nombre.trim()) {
            setStep(2);
        }
    };

    const handleTogglePost = (postId) => {
        setSelectedPosts((prev) =>
            prev.includes(postId)
                ? prev.filter((id) => id !== postId)
                : [...prev, postId]
        );
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setImageUploaded(true);
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImageUploaded(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (imageFile) {
            formData.append("portada", imageFile);
        }
        formData.append("nombre", nombre);
        formData.append("descripcion", descripcion);
        selectedPosts.forEach((postId) => {
            formData.append("selectedPosts[]", postId);
        });

        router.post(route("albums.store"), formData, {
            onFinish: () => handleClose(),
        });
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300);
    };

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
            <div
                className={`bg-[#292B2F] rounded-lg shadow-lg w-11/12 max-w-5xl h-[70vh] flex flex-col overflow-hidden relative transform transition-all duration-300 ${
                    isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-5"
                }`}
            >
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-white hover:text-red-400 z-10"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="flex-1 overflow-y-auto p-6 text-white">
                    {step === 1 ? (
                        <>
                            <h2 className="text-2xl font-bold mb-6">
                                Crear Álbum
                            </h2>
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Nombre del Álbum
                                    </label>
                                    <input
                                        type="text"
                                        value={nombre}
                                        onChange={(e) =>
                                            setNombre(e.target.value)
                                        }
                                        className="w-full px-3 py-2 rounded-md bg-[#1c1c1e] border border-white text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        value={descripcion}
                                        onChange={(e) =>
                                            setDescripcion(e.target.value)
                                        }
                                        className="w-full px-3 py-2 rounded-md bg-[#1c1c1e] border border-white text-white"
                                    />
                                </div>
                                <div className="text-center">
                                    {!imageUploaded ? (
                                        <div className="flex flex-col items-center space-y-3 mt-20">
                                            <label className="cursor-pointer border-dashed border-2 border-gray-500 rounded-md px-6 py-4 hover:bg-white hover:bg-opacity-10">
                                                <span>
                                                    Sube tu imagen de portada
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={
                                                        handleCoverImageChange
                                                    }
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center">
                                            <div className="relative">
                                                <img
                                                    src={URL.createObjectURL(
                                                        imageFile
                                                    )}
                                                    alt="Imagen subida"
                                                    className="h-auto max-h-[255px] w-full object-contain shadow-black shadow-2xl"
                                                />
                                                <button
                                                    onClick={handleRemoveImage}
                                                    type="button"
                                                    className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                                                >
                                                    <XMarkIcon className="h-6 w-6" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold mb-6">
                                Selecciona las Publicaciones
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 max-h-[50vh] overflow-y-auto p-4">
                                {posts.length === 0 ? (
                                    <p>No tienes posts disponibles.</p>
                                ) : (
                                    posts.map((post) => (
                                        <div
                                            key={post.id}
                                            onClick={() =>
                                                handleTogglePost(post.id)
                                            }
                                            className={`relative rounded cursor-pointer transition-all ${
                                                selectedPosts.includes(post.id)
                                                    ? "border-4 border-blue-500 bg-blue-100 bg-opacity-10"
                                                    : "border border-gray-600"
                                            }`}
                                        >
                                            <Image
                                                src={post.image.path_original}
                                                alt={post.titulo}
                                                className="object-cover w-full h-48 rounded"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center text-sm p-1">
                                                {post.titulo}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Contenedor de botones en la parte inferior derecha */}
                <div className="absolute bottom-6 right-6 flex gap-4">
                    {step === 1 && (
                        <>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                            >
                                Siguiente
                            </button>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                            >
                                Atrás
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
                            >
                                Crear Álbum
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Create;
