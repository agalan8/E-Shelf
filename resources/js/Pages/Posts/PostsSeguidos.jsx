import { Head, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import Post from '@/Components/Posts/Post';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import HomeSubnav from '@/Components/Subnavs/HomeSubnav';

const PostsSeguidos = ({ posts, tags }) => {
  // Comentarios por post (usamos un estado por post ID)
  const [comments, setComments] = useState({});
  const textareaRefs = useRef({});

  const handleCommentChange = (postId, value) => {
    setComments((prev) => ({ ...prev, [postId]: value }));
    autoResizeTextarea(postId);
  };

  const autoResizeTextarea = (postId) => {
    const textarea = textareaRefs.current[postId];
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  const handleCommentSubmit = (postId) => {
    const contenido = comments[postId]?.trim();
    if (!contenido) return;

    router.post(route('comments.store'), {
      contenido,
      commentable_id: postId,
      commentable_type: 'App\\Models\\Post',
    }, {
      onSuccess: () =>
        setComments((prev) => ({ ...prev, [postId]: '' })),
    });
  };

  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Seguidos</h2>}
      subnav={<HomeSubnav />}
    >
      <Head title="Mis publicaciones" />
      <div className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Seguidos</h2>

        {posts.length === 0 ? (
          <p>No sigues a nadie aún.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div key={post.id} className="space-y-2">
                <Post post={post} tags={tags} />

                {/* Campo para comentarios */}
                <div className="px-4">
                  <textarea
                    ref={(el) => (textareaRefs.current[post.id] = el)}
                    rows={1}
                    className="w-full border rounded-md p-2 text-sm resize-none overflow-hidden"
                    placeholder="Escribe un comentario..."
                    value={comments[post.id] || ''}
                    onChange={(e) => handleCommentChange(post.id, e.target.value)}
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1 rounded"
                  >
                    Comentar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default PostsSeguidos;
