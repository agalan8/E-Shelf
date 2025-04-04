import { Link, Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

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
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Crear publicación</h2>}>
            <Head title="Crear publicación" />
            <div className="container mx-auto p-4">
                {!imageUploaded ? (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <h1 className="text-4xl font-bold">Sube tu imagen</h1>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-4" />
                    </div>
                ) : (
                    <div>
                        <div className="flex flex-col items-center">
                            <img src={URL.createObjectURL(imageFile)} alt="Imagen subida" className="w-32 h-32 object-cover rounded-lg mb-4" />
                            <button onClick={handleRemoveImage} className="text-red-500 hover:text-red-700 mt-2">Eliminar Imagen</button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 mt-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="titulo" className="block text-lg font-semibold">Título</label>
                                    <input type="text" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full mt-2 p-2 border rounded" required />
                                </div>
                                <div>
                                    <label htmlFor="descripcion" className="block text-lg font-semibold">Descripción</label>
                                    <textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full mt-2 p-2 border rounded" required />
                                </div>
                                <div>
                                    <label htmlFor="localizacion" className="block text-lg font-semibold">Localización</label>
                                    <input type="text" id="localizacion" value={localizacion} onChange={(e) => setLocalizacion(e.target.value)} className="w-full mt-2 p-2 border rounded" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-lg font-semibold">Etiquetas</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {selectedTags.map(tag => (
                                        <div key={tag.id} className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-2">
                                            <span>{tag.nombre}</span>
                                            <button type="button" onClick={() => handleTagRemove(tag.id)} className="text-red-500">✕</button>
                                        </div>
                                    ))}
                                </div>
                                <div className="relative">
                                    <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full mt-2 p-2 border rounded bg-white text-left">Seleccionar etiqueta</button>
                                    {isDropdownOpen && (
                                        <div className="absolute w-full mt-1 border rounded bg-white shadow-md z-10 max-h-40 overflow-y-auto">
                                            <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 border-b" />
                                            {tags.filter(tag => tag.nombre.toLowerCase().includes(searchTerm.toLowerCase())).map(tag => (
                                                <div key={tag.id} className="cursor-pointer p-2 hover:bg-gray-200" onClick={() => handleTagSelect(tag)}>
                                                    {tag.nombre}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-span-2 flex justify-end">
                                <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Crear Publicación</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default PostCreate;
