import GuestPageLayout from '@/Layouts/GuestPageLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Post from '@/Components/Posts/Post';

export default function Explorar({ auth, posts, tags }) {
    const Layout = auth.user ? AuthenticatedLayout : GuestPageLayout;


    return (
        <Layout
            header={
                <h2 className=" font-semibold leading-tight">
                    Explorar
                </h2>
            }
        >
            <Head title="Explorar" />

            <div className="py-2">
                <div className="mx-auto max-w-8xl p-1">

                    {/* Mostrar los posts */}
                    <div className="flex flex-col md:flex-row gap-2">
                {[0, 1, 2].map((colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-2 flex-1">
                    {posts
                        .filter((_, index) => index % 3 === colIndex)
                        .map((post) => (
                        <Post key={post.id} getTotalLikes={post.getTotalLikes} isLikedByUser={post.isLikedByUser} isSharedByUser={post.isSharedByUser}
                      getTotalShares={post.getTotalShares} post={post} tags={tags} />
                        ))}
                    </div>
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
