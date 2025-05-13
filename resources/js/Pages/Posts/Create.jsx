import { Link, Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/solid';

const PostCreate = () => {
    const { tags } = usePage().props;
    const [imageFile, setImageFile] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [localizacion, setLocalizacion] = useState('');
    const [imageUploaded, setImageUploaded] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
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
        if (!selectedTags.some(t => t.id === tag.id)) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleTagRemove = (tagId) => {
        setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (imageFile) {
            formData.append('imagen', imageFile);
        }
        formData.append('titulo', titulo);
        formData.append('descripcion', descripcion);
        formData.append('localizacion', localizacion);
        selectedTags.forEach(tag => {
            formData.append('tags[]', tag.id);
        });
        router.post(route('posts.store'), formData);
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold leading-tight text-white">Crear publicación</h2>}>
            <Head title="Crear publicación" />
            <div className="container mx-auto">
                {!imageUploaded ? (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <h1 className="text-6xl font-bold text-white mt-40">Sube tu imagen</h1>
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
                        {/* Contenedor de la imagen */}
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

                        {/* Contenedor del formulario */}
                        <div className="w-[35%] bg-[#303136] p-6 shadow h-[80vh]">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="titulo" className="block text-lg font-semibold text-white">Título</label>
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
                                    <label htmlFor="descripcion" className="block text-lg font-semibold text-white">Descripción</label>
                                    <textarea
                                        id="descripcion"
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        className="w-full mt-2 p-2 border rounded-md bg-[#272729] hover:border-white focus:ring-white caret-white text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="localizacion" className="block text-lg font-semibold text-white">Localización</label>
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
                                    <label className="block text-lg font-semibold text-white">Etiquetas</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {selectedTags.map(tag => (
                                            <div key={tag.id} className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-2">
                                                <span>{tag.nombre}</span>
                                                <button type="button" onClick={() => handleTagRemove(tag.id)} className="text-red-500">✕</button>
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
                                                    .filter(tag => tag.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
                                                    .map(tag => (
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

                                <div className="flex justify-end">
                                    <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                                        Crear Publicación
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
