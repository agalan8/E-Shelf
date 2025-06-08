import { Link, Head, usePage, router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore, faCamera, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useToast } from "@/contexts/ToastProvider"; // Importa el hook

const containerStyle = { width: "100%", height: "300px" };
const centerDefault = { lat: 40.4168, lng: -3.7038 };
const libraries = ["places"];

const PostCreate = () => {
  const { tags, communities } = usePage().props;
  const [imageFile, setImageFile] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [localizacion, setLocalizacion] = useState("");
  const [ultimaLocalizacion, setUltimaLocalizacion] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const [selectedCommunities, setSelectedCommunities] = useState([]);
  const [communitySearchTerm, setCommunitySearchTerm] = useState("");
  const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false);
  const communityDropdownRef = useRef();
  const [isStoreActive, setIsStoreActive] = useState(false);
  const [precio, setPrecio] = useState("");
  const [locationCoords, setLocationCoords] = useState({ lat: null, lng: null });
  const searchBoxRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    titulo: false,
    descripcion: false,
    imagen: false,
    localizacion: false,
  });

  const { showToast } = useToast(); // Usa el hook

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsDropdownOpen(false);
      if (
        communityDropdownRef.current &&
        !communityDropdownRef.current.contains(e.target)
      )
        setIsCommunityDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "titulo":
        if (!value.trim()) error = "El título es obligatorio.";
        else if (value.length > 255) error = "Máximo 255 caracteres.";
        break;
      case "descripcion":
        if (!value.trim()) error = "La descripción es obligatoria.";
        else if (value.length > 255) error = "Máximo 255 caracteres.";
        break;
      case "imagen":
        if (!value) error = "La imagen es obligatoria.";
        else if (
          !["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
            value.type
          )
        )
          error = "Formato no permitido (jpeg, png, jpg, gif).";
        else if (value.size > 20480 * 1024)
          error = "La imagen no puede superar 20MB.";
        break;
      case "localizacion":
        if (value.length > 255) error = "Máximo 255 caracteres.";
        break;
      case "precio":
        if (isStoreActive) {
          if (!value) error = "El precio es obligatorio.";
          else if (!/^\d{1,10}(\.\d{2})?$/.test(value))
            error = "Formato de precio inválido (máx 10 dígitos y 2 decimales).";
        }
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  useEffect(() => {
    validateField("titulo", titulo);
  }, [titulo]);
  useEffect(() => {
    validateField("descripcion", descripcion);
  }, [descripcion]);
  useEffect(() => {
    validateField("localizacion", localizacion);
  }, [localizacion]);
  useEffect(() => {
    validateField("precio", precio);
  }, [precio, isStoreActive]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImageUploaded(true);
    setTouched((prev) => ({ ...prev, imagen: true }));
    validateField("imagen", file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUploaded(false);
  };

  const handleTagSelect = (tag) => {
    if (!selectedTags.some((t) => t.id === tag.id))
      setSelectedTags([...selectedTags, tag]);
  };
  const handleTagRemove = (id) =>
    setSelectedTags(selectedTags.filter((t) => t.id !== id));

  const handleCommunitySelect = (c) => {
    if (!selectedCommunities.some((x) => x.id === c.id))
      setSelectedCommunities([...selectedCommunities, c]);
  };
  const handleCommunityRemove = (id) =>
    setSelectedCommunities(selectedCommunities.filter((c) => c.id !== id));

  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (!places.length) return;
    const place = places[0];
    const loc = place.geometry.location;
    const lat = loc.lat(), lng = loc.lng();

    let city = "", country = "";
    place.address_components.forEach((comp) => {
      if (comp.types.includes("locality")) city = comp.long_name;
      if (comp.types.includes("country")) country = comp.long_name;
    });
    const formatted = `${city}${city && country ? ", " : ""}${country}`;

    setLocationCoords({ lat, lng });
    setLocalizacion(formatted || `${lat},${lng}`);
    setUltimaLocalizacion(formatted || `${lat},${lng}`);
  };

  const onMapClick = (e) => {
    const lat = e.latLng.lat(), lng = e.latLng.lng();
    setLocationCoords({ lat, lng });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat, lng }, language: "es" },
      (results, status) => {
        if (status === "OK" && results[0]) {
          const place = results[0];
          let city = "", country = "";
          place.address_components.forEach((c) => {
            if (c.types.includes("locality")) city = c.long_name;
            if (c.types.includes("country")) country = c.long_name;
          });
          const formatted = `${city}${city && country ? ", " : ""}${country}`;
          setLocalizacion(formatted || `${lat},${lng}`);
          setUltimaLocalizacion(formatted || `${lat},${lng}`);
        }
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (imageFile) formData.append("imagen", imageFile);
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);

    const trimmedLoc = localizacion.trim();
    const trimmedUltimaLoc = ultimaLocalizacion.trim();

    if (!trimmedLoc || trimmedLoc !== trimmedUltimaLoc) {
      formData.append("localizacion", trimmedUltimaLoc);
    } else {
      formData.append("localizacion", trimmedLoc);
    }

    if (locationCoords.lat && locationCoords.lng) {
      formData.append("latitud", locationCoords.lat);
      formData.append("longitud", locationCoords.lng);
    }

    selectedTags.forEach((t) => formData.append("tags[]", t.id));
    selectedCommunities.forEach((c) =>
      formData.append("communities[]", c.id)
    );

    if (isStoreActive) {
      formData.append("add_to_store", "1");
      formData.append("precio", precio);
    }

    router.post(route("regular-posts.store"), formData, {
      onSuccess: () => {
        showToast("¡Publicación creada con éxito!", "success");
      },
    });
  };


  return (
    <AuthenticatedLayout
      header={
        <h2 className="font-semibold leading-tight text-white">
          Crear Publicación
        </h2>
      }
    >
      <Head title="Crear publicación" />
      <div className="w-full mx-auto">
        {!imageUploaded ? (
          <div className="flex flex-col items-center justify-center h-96 text-white mt-24 sm:mt-10">
            <label
              htmlFor="image-upload"
              className="group relative cursor-pointer text-gray-400 transition-colors flex flex-col lg:block items-center"
              title="Subir imagen"
            >
              <FontAwesomeIcon
                icon={faCamera}
                className="w-40 h-40 sm:w-32 sm:h-32 lg:w-96 lg:h-96 transition-transform duration-200 group-hover:scale-105 mx-auto"
              />
              <FontAwesomeIcon
                icon={faCirclePlus}
                className="absolute bottom-2 right-1 sm:bottom-2 sm:right-1 lg:bottom-2 lg:-right-4 w-10 h-10 sm:w-8 sm:h-8 lg:w-28 lg:h-28 border-4 border-[#373841] rounded-full bg-[#373841] text-[#E0B0FF] text-opacity-60 transition-transform duration-200 group-hover:scale-110"
              />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <p className="mt-4 text-base sm:text-base lg:text-2xl text-center">
              ¡Haz clic en el icono para subir una Publicación!
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center gap-6 mt-4 h-auto lg:h-[90vh]">
            <div className="w-full lg:w-[65%] relative ml-0 lg:ml-6 mb-4 lg:mb-0">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Imagen subida"
                className="h-auto max-h-[40vh] lg:max-h-[80vh] w-full object-contain shadow-black shadow-2xl"
              />
              <button
                onClick={handleRemoveImage}
                type="button"
                className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="w-full lg:w-[35%] bg-[#303136] p-1 shadow h-auto lg:h-[90vh] flex flex-col">
              <form
                onSubmit={handleSubmit}
                className="space-y-4 flex flex-col flex-grow overflow-y-auto p-3 lg:p-6"
              >
                {/* Título */}
                <div>
                  <label className="block text-lg font-semibold text-white">
                    Título
                  </label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, titulo: true }))}
                    className="w-full mt-2 p-2 border rounded-md bg-[#272729] hover:border-white focus:ring-white caret-white text-white"
                    required
                  />
                  {touched.titulo && errors.titulo && (
                    <p className="text-red-400 text-sm mt-1">{errors.titulo}</p>
                  )}
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-lg font-semibold text-white">
                    Descripción
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, descripcion: true }))}
                    className=" resize-none w-full mt-2 p-2 border rounded-md bg-[#272729] hover:border-white focus:ring-white caret-white text-white"
                    required
                  />
                  {touched.descripcion && errors.descripcion && (
                    <p className="text-red-400 text-sm mt-1">{errors.descripcion}</p>
                  )}
                </div>

                {/* Imagen */}
                {!imageUploaded && touched.imagen && errors.imagen && (
                  <p className="text-red-400 text-sm mt-2">{errors.imagen}</p>
                )}

                {/* Localización */}
                <div>
                  <label className="block text-lg font-semibold text-white">
                    Localización
                  </label>
                  <LoadScript
                    googleMapsApiKey="AIzaSyCTy_UZS2tqbYIoYFUDkreos9Q8vq4pkEc"
                    libraries={libraries}
                  >
                    <StandaloneSearchBox
                      onLoad={(ref) => (searchBoxRef.current = ref)}
                      onPlacesChanged={onPlacesChanged}
                    >
                      <input
                        type="text"
                        placeholder="Escribe una ubicación"
                        value={localizacion}
                        onChange={(e) => setLocalizacion(e.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, localizacion: true }))}
                        className="w-full mt-2 mb-4 p-2 border rounded-md bg-[#272729] hover:border-white focus:ring-white caret-white text-white"
                      />
                    </StandaloneSearchBox>

                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={
                        locationCoords.lat && locationCoords.lng
                          ? locationCoords
                          : centerDefault
                      }
                      zoom={8}
                      onClick={onMapClick}
                    >
                      {locationCoords.lat && locationCoords.lng && (
                        <Marker position={locationCoords} />
                      )}
                    </GoogleMap>
                  </LoadScript>
                  {touched.localizacion && errors.localizacion && (
                    <p className="text-red-400 text-sm mt-1">{errors.localizacion}</p>
                  )}
                </div>

                {/* Etiquetas y comunidades */}
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
                      <div className="absolute w-full mt-1 border rounded bg-[#272729] shadow-md z-10 max-h-40 overflow-y-auto">
                        <input
                          type="text"
                          placeholder="Buscar..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full p-2 border-b rounded-md bg-[#272729] text-white placeholder-gray-400 focus:ring-white"
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
                              onClick={() => handleTagSelect(tag)}
                              className="p-2 cursor-pointer hover:bg-[#373841] text-white"
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
                    {selectedCommunities.map((community) => (
                      <div
                        key={community.id}
                        className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-2"
                      >
                        <span>{community.nombre}</span>
                        <button
                          type="button"
                          onClick={() => handleCommunityRemove(community.id)}
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
                      <div className="absolute w-full mt-1 border rounded bg-[#272729] shadow-md z-10 max-h-40 overflow-y-auto">
                        <input
                          type="text"
                          placeholder="Buscar..."
                          value={communitySearchTerm}
                          onChange={(e) =>
                            setCommunitySearchTerm(e.target.value)
                          }
                          className="w-full p-2 border-b rounded-md bg-[#272729] text-white placeholder-gray-400 focus:ring-white"
                        />
                        {communities
                          .filter((community) =>
                            community.nombre
                              .toLowerCase()
                              .includes(communitySearchTerm.toLowerCase())
                          )
                          .map((community) => (
                            <div
                              key={community.id}
                              onClick={() => handleCommunitySelect(community)}
                              className="p-2 cursor-pointer hover:bg-[#373841] text-white"
                            >
                              {community.nombre}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* Tienda y precio */}
                <div className="mt-4">
                  <div className="flex justify-center mt-3 mb-4 min-h-[50px]">
                    <button
                      type="button"
                      onClick={() => {
                        if (isStoreActive) setPrecio("");
                        setIsStoreActive(!isStoreActive);
                      }}
                      className={`flex items-center gap-2 py-3 px-6 rounded-md font-bold transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7A27BC] ${
                        isStoreActive
                          ? "bg-[#7A27BC] text-white border border-[#7A27BC]"
                          : "bg-transparent text-white border border-[#7A27BC] hover:scale-105"
                      }`}
                      style={{ minWidth: "180px" }}
                    >
                      <FontAwesomeIcon icon={faStore} />
                      Añadir a tienda
                    </button>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isStoreActive ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <label className="block text-lg font-semibold text-white mb-1">
                      Precio
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={precio}
                      onChange={(e) => setPrecio(e.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, precio: true }))}
                      className="w-full p-2 rounded-md bg-[#272729] border border-gray-600 text-white focus:border-white focus:ring-white"
                      placeholder="Introduce el precio"
                      required={isStoreActive}
                    />
                    {isStoreActive && touched.precio && errors.precio && (
                      <p className="text-red-400 text-sm mt-1">{errors.precio}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="bg-purple-600 text-white rounded px-4 py-2 mt-5 hover:bg-purple-700"
                  >
                    Crear publicación
                  </button>
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
