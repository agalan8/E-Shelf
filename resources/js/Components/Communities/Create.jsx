import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import ImageInput from "@/Components/ImageInput";

export default function Create({ onClose }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagePerfil, setImagePerfil] = useState(null);
  const [imageFondo, setImageFondo] = useState(null);
  const [visibilidad, setVisibilidad] = useState("publico"); // público por defecto
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
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

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-[#292B2F] rounded-lg shadow-lg w-11/12 max-w-3xl h-auto flex flex-col overflow-hidden relative transform transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-5"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-red-400 z-10"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="p-6 text-white">
          <h2 className="text-2xl font-bold mb-6">Crear Comunidad</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre de la comunidad</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#1c1c1e] border border-white text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#1c1c1e] border border-white text-white"
              />
            </div>

            {/* Visibilidad */}
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

            {/* Inputs de imágenes uno al lado del otro */}
            <div className="flex flex-wrap gap-4">
              {/* Imagen de perfil */}
              <div className="flex-1 min-w-[200px]">
                <ImageInput
                  name="profile_image"
                  label="Imagen de perfil"
                  onChange={setImagePerfil}
                  previewClassName="rounded-full w-[145px] h-[145px] object-cover"
                />
              </div>

              {/* Imagen de fondo */}
              <div className="flex-1 min-w-[200px]">
                <ImageInput
                  name="background_image"
                  label="Imagen de fondo"
                  onChange={setImageFondo}
                  previewClassName="w-[325px] h-[145px] object-cover rounded-md"
                />
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
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
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
