import { Link, Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const PostCreate = () => {
    const [imageFile, setImageFile] = useState(null); // Almacenamos el archivo de imagen
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [localizacion, setLocalizacion] = useState('');
    const [imageUploaded, setImageUploaded] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImageFile(file); // Almacenamos el archivo
        setImageUploaded(true); // La imagen ha sido subida
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImageUploaded(false); // Vuelve a la vista de "sube tu imagen"
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Crear un FormData para enviar los datos (incluyendo la imagen)
        const formData = new FormData();
        if (imageFile) {
            formData.append('imagen', imageFile); // Asegúrate de enviar el archivo de imagen real
        }
        formData.append('titulo', titulo);
        formData.append('descripcion', descripcion);
        formData.append('localizacion', localizacion);

        // Enviar el formulario con Inertia
        router.post(route('posts.store'), formData, {

                    });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Crear publicación</h2>}
        >
            <Head title="Crear publicación" />
            <div className="container mx-auto p-4">
                {!imageUploaded ? (
                    // Paso 1: Subir la imagen
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <h1 className="text-4xl font-bold">Sube tu imagen</h1>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="mt-4"
                        />
                    </div>
                ) : (
                    // Paso 2: Formulario de Título, Descripción y Localización
                    <div>
                        {/* Mostrar imagen pequeña */}
                        <div className="flex flex-col items-center">
                            <img
                                src={URL.createObjectURL(imageFile)} // Generar URL local de la imagen subida
                                alt="Imagen subida"
                                className="w-32 h-32 object-cover rounded-lg mb-4"
                            />
                            <button
                                onClick={handleRemoveImage}
                                className="text-red-500 hover:text-red-700 mt-2"
                            >
                                Eliminar Imagen
                            </button>
                        </div>

                        {/* Formulario de datos */}
                        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                            <div>
                                <label htmlFor="titulo" className="block text-lg font-semibold">Título</label>
                                <input
                                    type="text"
                                    id="titulo"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    className="w-full mt-2 p-2 border rounded"
                                    placeholder="Escribe el título"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="descripcion" className="block text-lg font-semibold">Descripción</label>
                                <textarea
                                    id="descripcion"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    className="w-full mt-2 p-2 border rounded"
                                    placeholder="Escribe una breve descripción"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="localizacion" className="block text-lg font-semibold">Localización</label>
                                <input
                                    type="text"
                                    id="localizacion"
                                    value={localizacion}
                                    onChange={(e) => setLocalizacion(e.target.value)}
                                    className="w-full mt-2 p-2 border rounded"
                                    placeholder="Escribe la localización"
                                    required
                                />
                            </div>
                            <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                                Crear Publicación
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default PostCreate;
