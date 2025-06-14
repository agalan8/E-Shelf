import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Image from "../Image";
import { useToast } from "@/contexts/ToastProvider";

const Create = ({ onClose, posts }) => {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [selectedPosts, setSelectedPosts] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [step, setStep] = useState(1);
    const [isVisible, setIsVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const [searchTitle, setSearchTitle] = useState("");
    const { showToast } = useToast();

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 10);
    }, []);

    const validateField = (field, value) => {
        let error = "";
        if (field === "nombre") {
            if (!value.trim()) error = "El nombre es obligatorio.";
            else if (value.length > 255) error = "Máximo 255 caracteres.";
        }
        if (field === "descripcion") {
            if (value.length > 255) error = "Máximo 255 caracteres.";
        }
        if (field === "portada") {
            if (value) {
                const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/jpg",
                    "image/gif",
                ];
                if (!allowedTypes.includes(value.type))
                    error = "Formato no permitido.";
                if (value.size > 20480 * 1024) error = "Máximo 20MB.";
            }
        }
        setErrors((prev) => ({ ...prev, [field]: error }));
    };

    const handleNombreChange = (e) => {
        setNombre(e.target.value);
        validateField("nombre", e.target.value);
    };

    const handleDescripcionChange = (e) => {
        setDescripcion(e.target.value);
        validateField("descripcion", e.target.value);
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setImageUploaded(!!file);
        validateField("portada", file);
    };

    const handleNextStep = () => {
        validateField("nombre", nombre);
        validateField("descripcion", descripcion);
        if (!errors.nombre && !errors.descripcion && nombre.trim()) {
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
            onSuccess: () => {
                showToast("¡Álbum creado con éxito!", "success");
                handleClose();
            },
        });
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300);
    };

    // Función para cerrar modal al hacer clic en el overlay
    const handleOverlayClick = () => {
        handleClose();
    };

    // Evita que el clic dentro del modal propague al overlay
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    // Filtrar posts por título
    const filteredPosts = posts.filter((post) =>
        post.posteable.titulo
            ?.toLowerCase()
            .includes(searchTitle.trim().toLowerCase())
    );

    return (
        <div
            onClick={handleOverlayClick}
            className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
            <div
                onClick={handleModalClick}
                className={`bg-[#292B2F] rounded-lg shadow-lg
        w-[98vw] max-w-[98vw] h-[98vh]
        sm:w-11/12 sm:max-w-5xl sm:h-[70vh]
        flex flex-col overflow-hidden relative transform transition-all duration-300 ${
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
                                        onChange={handleNombreChange}
                                        className="w-full px-3 py-2 rounded-md bg-[#1c1c1e] border border-white text-white"
                                        required
                                    />
                                    {errors.nombre && (
                                        <p className="text-red-400 text-xs mt-1">{errors.nombre}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        value={descripcion}
                                        onChange={handleDescripcionChange}
                                        className="w-full px-3 py-2 rounded-md bg-[#1c1c1e] border border-white text-white h-[120px] resize-none"
                                    />
                                    {errors.descripcion && (
                                        <p className="text-red-400 text-xs mt-1">{errors.descripcion}</p>
                                    )}
                                </div>
                                <div className="text-center">
                                    {!imageUploaded ? (
                                        <div className="flex flex-col items-center space-y-3 mt-20">
                                            <label className="cursor-pointer border-dashed border-2 border-gray-500 rounded-md px-6 py-4 hover:bg-white hover:bg-opacity-10">
                                                <span>
                                                    Sube una imagen de portada
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleCoverImageChange}
                                                    className="hidden"
                                                />
                                            </label>
                                            {errors.portada && (
                                                <p className="text-red-400 text-xs mt-1">{errors.portada}</p>
                                            )}
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
                            {/* Campo de búsqueda por título */}
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={searchTitle}
                                    onChange={(e) => setSearchTitle(e.target.value)}
                                    placeholder="Buscar por título"
                                    className="w-full sm:w-1/2 px-3 py-2 rounded bg-[#1c1c1e] border border-white text-white"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 max-h-[75vh] sm:max-h-[45vh] overflow-y-auto p-4">
                                {filteredPosts.length === 0 ? (
                                    <p>No hay publicaciones con ese título.</p>
                                ) : (
                                    filteredPosts.map((post) => (
                                        <div
                                            key={post.posteable.id}
                                            onClick={() =>
                                                handleTogglePost(post.posteable.id)
                                            }
                                            className={`relative rounded cursor-pointer transition-all ${
                                                selectedPosts.includes(post.posteable.id)
                                                    ? "border-4 border-purple-500 bg-purple-100 bg-opacity-10"
                                                    : "border border-gray-600"
                                            }`}
                                        >
                                            <Image
                                                src={post.posteable.image.path_original}
                                                alt={post.posteable.titulo}
                                                className="object-cover w-full h-48 rounded"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center text-sm p-1">
                                                {post.posteable.titulo}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>

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
                                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500"
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
                                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500"
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
