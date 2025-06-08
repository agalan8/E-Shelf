import React, { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import ImageInput from "@/Components/ImageInput";

export default function Create({ onClose }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagePerfil, setImagePerfil] = useState(null);
  const [imageFondo, setImageFondo] = useState(null);
  const [visibilidad, setVisibilidad] = useState("publico");
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const modalRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("visibilidad", visibilidad);
    if (imagePerfil) formData.append("profile_image", imagePerfil);
    if (imageFondo) formData.append("background_image", imageFondo);

    router.post(route("communities.store"), formData, {
      onFinish: () => handleClose(),
    });
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  // Validaciones en caliente
  const validateNombre = (value) => {
    if (!value) return "El nombre es obligatorio.";
    if (value.length > 255) return "Máximo 255 caracteres.";
    return "";
  };

  const validateDescripcion = (value) => {
    if (value && value.length > 255) return "Máximo 255 caracteres.";
    return "";
  };

  const validateImage = (file) => {
    if (!file) return "";
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    if (!validTypes.includes(file.type)) return "Formato no permitido.";
    if (file.size > 20480 * 1024) return "Máximo 20MB.";
    return "";
  };

  // Handlers con validación
  const handleNombreChange = (e) => {
    const value = e.target.value;
    setNombre(value);
    setErrors((prev) => ({ ...prev, nombre: validateNombre(value) }));
  };

  const handleDescripcionChange = (e) => {
    const value = e.target.value;
    setDescripcion(value);
    setErrors((prev) => ({ ...prev, descripcion: validateDescripcion(value) }));
  };

  const handleImagePerfilChange = (file) => {
    setImagePerfil(file);
    setErrors((prev) => ({ ...prev, imagePerfil: validateImage(file) }));
  };

  const handleImageFondoChange = (file) => {
    setImageFondo(file);
    setErrors((prev) => ({ ...prev, imageFondo: validateImage(file) }));
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={modalRef}
        className={`bg-[#36393F] rounded-lg shadow-lg w-11/12 max-w-3xl h-auto flex flex-col overflow-hidden relative transform transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-5"
        }
        p-2 sm:p-6
        max-h-[95vh] sm:max-h-none
        `}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-red-400 z-10"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="p-2 sm:p-6 text-white">
          <h2 className="text-2xl font-bold mb-6">Crear Comunidad</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre de la comunidad</label>
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
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={descripcion}
                onChange={handleDescripcionChange}
                className="w-full px-3 py-2 rounded-md bg-[#1c1c1e] border border-white text-white resize-none"
              />
              {errors.descripcion && (
                <p className="text-red-400 text-xs mt-1">{errors.descripcion}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Visibilidad</label>
              <div className="flex gap-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="visibilidad"
                    value="publico"
                    checked={visibilidad === "publico"}
                    onChange={() => setVisibilidad("publico")}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2">Público</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="visibilidad"
                    value="privado"
                    checked={visibilidad === "privado"}
                    onChange={() => setVisibilidad("privado")}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2">Privado</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <div className="flex-1 min-w-[140px] sm:min-w-[200px]">
                <ImageInput
                  name="profile_image"
                  label="Imagen de perfil"
                  onChange={handleImagePerfilChange}
                  previewClassName="rounded-full w-[100px] h-[100px] sm:w-[145px] sm:h-[145px] object-cover"
                />
                {errors.imagePerfil && (
                  <p className="text-red-400 text-xs mt-1">{errors.imagePerfil}</p>
                )}
              </div>
              <div className="flex-1 min-w-[140px] sm:min-w-[200px]">
                <ImageInput
                  name="background_image"
                  label="Imagen de fondo"
                  onChange={handleImageFondoChange}
                  previewClassName="w-[200px] h-[90px] sm:w-[325px] sm:h-[145px] object-cover rounded-md"
                />
                {errors.imageFondo && (
                  <p className="text-red-400 text-xs mt-1">{errors.imageFondo}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={handleClose}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500"
              >
                Crear Comunidad
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
