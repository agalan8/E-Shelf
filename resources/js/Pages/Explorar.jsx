import GuestPageLayout from '@/Layouts/GuestPageLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Post from '@/Components/Posts/Post'; // Asegúrate de importar el componente Post

export default function Explorar({ auth, posts, tags }) {
    // Condición para verificar si el usuario está autenticado
    const Layout = auth.user ? AuthenticatedLayout : GuestPageLayout;

    return (
        <Layout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Explorar
                </h2>
            }
        >
            <Head title="Explorar" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* Mostrar los posts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {posts.map(post => (
                            <Post key={post.id} post={post} tags={tags} />
                        ))}
                    </div>

                    {/* Mostrar paginación si existe */}
                    {posts.links && posts.links.length > 0 && (
                        <div className="mt-6 flex justify-center">
                            {posts.links.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url}
                                    className={`px-4 py-2 mx-1 text-sm ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded`}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
