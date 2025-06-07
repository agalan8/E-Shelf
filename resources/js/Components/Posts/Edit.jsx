import { router, usePage } from "@inertiajs/react";
import React, { useState, useEffect, useRef } from "react";
import { XMarkIcon, ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import Image from "../Image";
import {
    GoogleMap,
    LoadScript,
    Marker,
    StandaloneSearchBox,
} from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "300px",
};

const libraries = ["places"];

const Edit = ({ post, onClose, tags }) => {
    const { props } = usePage();
    const userCommunities = props.auth.communities || [];

    const [titulo, setTitulo] = useState(post?.titulo || "");
    const [descripcion, setDescripcion] = useState(post?.descripcion || "");
    const [localizacion, setLocalizacion] = useState(post?.image?.localizacion || "");
    const [ultimaLocalizacion, setUltimaLocalizacion] = useState(post?.image?.localizacion || "");

    const [locationCoords, setLocationCoords] = useState(
        post?.image?.latitud && post?.image?.longitud
            ? {
                  lat: parseFloat(post.image.latitud),
                  lng: parseFloat(post.image.longitud),
              }
            : { lat: 40.4168, lng: -3.7038 } // fallback: Madrid
    );

    const centerDefault = locationCoords;

    const [selectedTags, setSelectedTags] = useState(post?.tags || []);
    const [selectedCommunities, setSelectedCommunities] = useState(
        post?.communities || []
    );
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(post?.image?.path_medium || null);
    const [searchTerm, setSearchTerm] = useState("");
    const [communitySearch, setCommunitySearch] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const tagDropdownRef = useRef();
    const communityDropdownRef = useRef();
    const searchBoxRef = useRef(null);

    const onPlacesChanged = () => {
        const places = searchBoxRef.current.getPlaces();
        if (places.length === 0) return;

        const place = places[0];
        const location = place.geometry.location;
        const lat = location.lat();
        const lng = location.lng();

        let city = "";
        let country = "";

        place.address_components.forEach((component) => {
            if (component.types.includes("locality")) {
                city = component.long_name;
            }
            if (component.types.includes("country")) {
                country = component.long_name;
            }
        });

        const formatted = `${city}${city && country ? ", " : ""}${country}`;

        setLocationCoords({ lat, lng });
        setLocalizacion(formatted || `${lat},${lng}`);
        setUltimaLocalizacion(formatted || `${lat},${lng}`);
    };

    const onMapClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setLocationCoords({ lat, lng });

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
            { location: { lat, lng }, language: "es" },
            (results, status) => {
                if (status === "OK" && results[0]) {
                    const place = results[0];
                    let city = "";
                    let country = "";

                    place.address_components.forEach((component) => {
                        if (component.types.includes("locality")) {
                            city = component.long_name;
                        }
                        if (component.types.includes("country")) {
                            country = component.long_name;
                        }
                    });

                    const formatted = `${city}${city && country ? ", " : ""}${country}`;
                    setLocalizacion(formatted || `${lat},${lng}`);
                    setUltimaLocalizacion(formatted || `${lat},${lng}`);
                }
            }
        );
    };

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                tagDropdownRef.current &&
                !tagDropdownRef.current.contains(event.target)
            ) {
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
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleTagSelect = (tag) => {
        if (!selectedTags.find((t) => t.id === tag.id)) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleCommunitySelect = (community) => {
        if (!selectedCommunities.find((c) => c.id === community.id)) {
            setSelectedCommunities([...selectedCommunities, community]);
        }
    };

    const handleTagRemove = (id) =>
        setSelectedTags(selectedTags.filter((t) => t.id !== id));
    const handleCommunityRemove = (id) =>
        setSelectedCommunities(selectedCommunities.filter((c) => c.id !== id));

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("titulo", titulo);
        formData.append("descripcion", descripcion);
        const trimmedLoc = localizacion.trim();
        const trimmedUltimaLoc = ultimaLocalizacion.trim();

        if (!trimmedLoc || trimmedLoc !== trimmedUltimaLoc) {
            // Input vacío o modificado: enviar última localización válida
            formData.append("localizacion", trimmedUltimaLoc);
        } else {
            // No ha sido modificado: enviar tal cual
            formData.append("localizacion", trimmedLoc);
        }
        formData.append("latitud", locationCoords.lat);
        formData.append("longitud", locationCoords.lng);
        if (imageFile) formData.append("imagen", imageFile);
        selectedTags.forEach((tag) => formData.append("tags[]", tag.id));
        selectedCommunities.forEach((c) =>
            formData.append("communities[]", c.id)
        );
        formData.append("_method", "PUT");

        router.post(route("regular-posts.update", post.id), formData, {
            preserveScroll: true,
        });
        handleClose();
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
            <div className="bg-[#1f1f1f] rounded-lg shadow-lg w-11/12 h-[90vh] flex flex-col md:flex-row overflow-hidden relative transform transition-all duration-300 md:h-[90vh] md:w-11/12">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-white hover:text-red-400 z-10"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                {/* Imagen */}
                <div className="w-full md:w-2/3 flex items-center justify-center bg-[#292B2F] p-28 md:p-6 min-h-[200px] max-h-[40vh] md:max-h-full  md:mb-0">
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        <Image
                            src={previewImage}
                            alt="Imagen actual"
                            className="max-h-60 md:max-h-full max-w-full object-contain rounded shadow-2xl shadow-black"
                        />
                        <label className="cursor-pointer mt-3 text-white hover:underline">
                            <ArrowUpTrayIcon className="w-5 h-5 inline mr-2" />
                            Subir nueva imagen
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {/* Formulario */}
                <div className="w-full md:w-1/3 p-4 md:p-6 bg-[#272729] overflow-y-auto text-white max-h-[60vh] md:max-h-full">
                    <h2 className="text-xl font-bold mb-6">Editar Publicación</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            className="w-full p-3 rounded bg-[#1c1c1e]"
                            placeholder="Título"
                        />
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="w-full p-3 rounded bg-[#1c1c1e]"
                            placeholder="Descripción"
                        />

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
                                        className="w-full mt-2 mb-4 p-2 border rounded-md bg-[#272729] text-white"
                                        value={localizacion}
                                        onChange={(e) => setLocalizacion(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                </StandaloneSearchBox>

                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={centerDefault}
                                    zoom={8}
                                    onClick={onMapClick}
                                >
                                    <Marker position={locationCoords} />
                                </GoogleMap>
                            </LoadScript>
                        </div>

                        {/* Tags */}
                        <div className="mt-6">
                            <label className="block font-semibold mb-4">Etiquetas</label>

                            <div className="flex flex-wrap gap-3 mb-4">
                                {selectedTags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm flex items-center"
                                    >
                                        {tag.nombre}
                                        <button
                                            type="button"
                                            onClick={() => handleTagRemove(tag.id)}
                                            className="ml-2 text-red-400"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>

                            <div className="relative" ref={tagDropdownRef}>
                                <input
                                    type="text"
                                    placeholder="Buscar etiquetas..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    className="w-full p-3 rounded bg-[#1c1c1e] min-h-[44px]"
                                />

                                {isDropdownOpen && (
                                    <div className="absolute w-full bg-[#2f2f2f] rounded mt-2 max-h-56 overflow-y-auto z-10 border border-gray-600">
                                        {tags
                                            .filter((tag) =>
                                                tag.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map((tag) => (
                                                <div
                                                    key={tag.id}
                                                    onClick={() => handleTagSelect(tag)}
                                                    className="p-3 hover:bg-gray-600 cursor-pointer text-sm"
                                                >
                                                    {tag.nombre}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Comunidades */}
                        <div className="mt-6">
                            <label className="block font-semibold mb-4">Comunidades</label>

                            <div className="flex flex-wrap gap-3 mb-4">
                                {selectedCommunities.map((c) => (
                                    <span
                                        key={c.id}
                                        className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm flex items-center"
                                    >
                                        {c.nombre}
                                        <button
                                            type="button"
                                            onClick={() => handleCommunityRemove(c.id)}
                                            className="ml-2 text-red-400"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>

                            <div className="relative" ref={communityDropdownRef}>
                                <input
                                    type="text"
                                    placeholder="Buscar comunidades..."
                                    value={communitySearch}
                                    onChange={(e) => setCommunitySearch(e.target.value)}
                                    onFocus={() => setIsCommunityDropdownOpen(true)}
                                    className="w-full p-3 rounded bg-[#1c1c1e] min-h-[44px]"
                                />

                                {isCommunityDropdownOpen && (
                                    <div className="absolute w-full bg-[#2f2f2f] rounded mt-2 max-h-56 overflow-y-auto z-10 border border-gray-600">
                                        {userCommunities
                                            .filter((c) =>
                                                c.nombre.toLowerCase().includes(communitySearch.toLowerCase())
                                            )
                                            .map((c) => (
                                                <div
                                                    key={c.id}
                                                    onClick={() => handleCommunitySelect(c)}
                                                    className="p-3 hover:bg-gray-600 cursor-pointer text-sm"
                                                >
                                                    {c.nombre}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg text-base font-semibold mt-8"
                        >
                            Guardar Cambios
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Edit;
