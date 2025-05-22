import { Link, Head, usePage, router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";

const PostCreate = () => {
  const { tags, communities } = usePage().props;

  const [imageFile, setImageFile] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [localizacion, setLocalizacion] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);

  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const [selectedCommunities, setSelectedCommunities] = useState([]);
  const [communitySearchTerm, setCommunitySearchTerm] = useState("");
  const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false);
  const communityDropdownRef = useRef();

  // Estado para el botón "Añadir a tienda"
  const [isStoreActive, setIsStoreActive] = useState(false);

  // Estado para el input de precio
  const [precio, setPrecio] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        communityDropdownRef.current &&
        !communityDropdownRef.current.contains(event.target)
      ) {
        setIsCommunityDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImageUploaded(true);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUploaded(false);
  };

  const handleTagSelect = (tag) => {
    if (!selectedTags.some((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tagId) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const handleCommunitySelect = (community) => {
    if (!selectedCommunities.some((c) => c.id === community.id)) {
      setSelectedCommunities([...selectedCommunities, community]);
    }
  };

  const handleCommunityRemove = (communityId) => {
    setSelectedCommunities(
      selectedCommunities.filter((c) => c.id !== communityId)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (imageFile) {
      formData.append("imagen", imageFile);
    }
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("localizacion", localizacion);

    selectedTags.forEach((tag) => {
      formData.append("tags[]", tag.id);
    });

    selectedCommunities.forEach((community) => {
      formData.append("communities[]", community.id);
    });

    if (isStoreActive) {
      formData.append("add_to_store", "1");
      formData.append("precio", precio);
    }

    router.post(route("regular-posts.store"), formData);
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="font-semibold leading-tight text-white">
          Crear publicación
        </h2>
      }
    >
      <Head title="Crear publicación" />
      <div className="w-[100%] mx-auto">
        {!imageUploaded ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <h1 className="text-6xl font-bold text-white mt-40">
              Sube tu imagen
            </h1>
            <label className="cursor-pointer flex flex-col items-center justify-center mt-4 p-10 border-2 border-dashed border-gray-400 rounded-lg hover:bg-[#7A27BC] hover:bg-opacity-15 transition">
              <ArrowUpTrayIcon className="h-16 w-16 text-gray-400 mb-2" />
              <span className="text-white">Haz clic para subir una imagen</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="flex items-center gap-6 mt-4 h-[90vh]">
            <div className="w-[65%] relative ml-6">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Imagen subida"
                className="h-auto max-h-[80vh] w-full object-contain shadow-black shadow-2xl"
              />
              <button
                onClick={handleRemoveImage}
                type="button"
                className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Contenedor formulario con alto completo y flex */}
            <div className="w-[35%] bg-[#303136] p-6 shadow h-[90vh] flex flex-col">
              <form
                onSubmit={handleSubmit}
                className="space-y-4 flex flex-col flex-grow overflow-y-auto"
              >
                <div>
                  <label
                    htmlFor="titulo"
                    className="block text-lg font-semibold text-white"
                  >
                    Título
                  </label>
                  <input
                    type="text"
                    id="titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full mt-2 p-2 border rounded-md bg-[#272729] hover:border-white focus:ring-white caret-white text-white"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="descripcion"
                    className="block text-lg font-semibold text-white"
                  >
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full mt-2 p-2 border rounded-md bg-[#272729] hover:border-white focus:ring-white caret-white text-white"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="localizacion"
                    className="block text-lg font-semibold text-white"
                  >
                    Localización
                  </label>
                  <input
                    type="text"
                    id="localizacion"
                    value={localizacion}
                    onChange={(e) => setLocalizacion(e.target.value)}
                    className="w-full mt-2 p-2 border rounded-md bg-[#272729] hover:border-white focus:ring-white caret-white text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-white">
                    Etiquetas
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTags.map((tag) => (
                      <div
                        key={tag.id}
                        className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-2"
                      >
                        <span>{tag.nombre}</span>
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag.id)}
                          className="text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full mt-2 p-2 border text-left rounded-md bg-[#272729] hover:border-white focus:ring-white caret-white text-white"
                    >
                      Seleccionar etiqueta...
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute w-full mt-1 border rounded bg-white shadow-md z-10 max-h-40 overflow-y-auto">
                        <input
                          type="text"
                          placeholder="Buscar..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full p-2 border-b rounded-md bg-[#272729] hover:border-white focus:ring-white caret-white text-white"
                        />
                        {tags
                          .filter((tag) =>
                            tag.nombre
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          )
                          .map((tag) => (
                            <div
                              key={tag.id}
                              className="cursor-pointer p-2 hover:bg-opacity-80 bg-[#272729] hover:border-white focus:ring-white caret-white text-white"
                              onClick={() => handleTagSelect(tag)}
                            >
                              {tag.nombre}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-white">
                    Comunidades
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedCommunities.map((com) => (
                      <div
                        key={com.id}
                        className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-2"
                      >
                        <span>{com.nombre}</span>
                        <button
                          type="button"
                          onClick={() => handleCommunityRemove(com.id)}
                          className="text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="relative" ref={communityDropdownRef}>
                    <button
                      type="button"
                      onClick={() =>
                        setIsCommunityDropdownOpen(!isCommunityDropdownOpen)
                      }
                      className="w-full mt-2 p-2 border text-left rounded-md bg-[#272729] hover:border-white focus:ring-white caret-white text-white"
                    >
                      Seleccionar comunidad...
                    </button>
                    {isCommunityDropdownOpen && (
                      <div className="absolute w-full mt-1 border rounded bg-white shadow-md z-10 max-h-40 overflow-y-auto">
                        <input
                          type="text"
                          placeholder="Buscar comunidades..."
                          value={communitySearchTerm}
                          onChange={(e) => setCommunitySearchTerm(e.target.value)}
                          className="w-full p-2 border-b rounded-md bg-[#272729] hover:border-white focus:ring-white caret-white text-white"
                        />
                        {communities
                          .filter((com) =>
                            com.nombre
                              .toLowerCase()
                              .includes(communitySearchTerm.toLowerCase())
                          )
                          .map((com) => (
                            <div
                              key={com.id}
                              className="cursor-pointer p-2 hover:bg-opacity-80 bg-[#272729] hover:border-white focus:ring-white caret-white text-white"
                              onClick={() => handleCommunitySelect(com)}
                            >
                              {com.nombre}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-center mt-3 mb-4 min-h-[50px]">
                    <button
                      type="button"
                      onClick={() => {
                        if (isStoreActive) {
                          setPrecio(""); // Limpia precio si se desactiva
                        }
                        setIsStoreActive(!isStoreActive);
                      }}
                      className={`flex items-center gap-2 py-3 px-6 rounded-md font-bold transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7A27BC]
                          ${
                            isStoreActive
                              ? "bg-[#7A27BC] text-white border border-[#7A27BC]"
                              : "bg-transparent text-white border border-[#7A27BC] hover:text-white hover:scale-105"
                          }
                        `}
                      style={{ minWidth: "180px" }}
                    >
                      <FontAwesomeIcon icon={faStore} />
                      Añadir a tienda
                    </button>
                  </div>

                  {/* Input precio con efecto */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isStoreActive ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <label
                      htmlFor="precio"
                      className="block text-lg font-semibold text-white mb-1"
                    >
                      Precio
                    </label>
                    <input
                      type="number"
                      id="precio"
                      min="0"
                      step="0.01"
                      value={precio}
                      onChange={(e) => setPrecio(e.target.value)}
                      className="w-full p-2 rounded-md bg-[#272729] border border-gray-600 text-white focus:border-white focus:ring-white"
                      placeholder="Introduce el precio"
                      required={isStoreActive}
                    />
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-3 px-6 rounded font-bold hover:bg-blue-600"
                    >
                      Crear Publicación
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default PostCreate;
