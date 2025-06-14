import { Head, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import Post from '@/Components/Posts/Post';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import HomeSubnav from '@/Components/Subnavs/HomeSubnav';

const PostsSeguidos = ({ posts, tags }) => {
  const [comments, setComments] = useState({});
  const textareaRefs = useRef({});

  const [likes, setLikes] = useState({});
  const [hoveredLike, setHoveredLike] = useState({});

  useEffect(() => {
    setLikes(Object.fromEntries(posts.map((post) => [post.id, post.isLikedByUser])));
  }, [posts]);

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

    router.post(
      route('comments.store'),
      {
        contenido,
        commentable_id: postId,
        commentable_type: 'App\\Models\\RegularPost',
      },
      {
        onSuccess: () =>
          setComments((prev) => ({ ...prev, [postId]: '' })),
      }
    );
  };

  const handleKeyDown = (postId, e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit(postId);
    }
  };

  const timeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const seconds = Math.floor((now - postDate) / 1000);

    const intervals = [
      { label: 'año', seconds: 31536000 },
      { label: 'mes', seconds: 2592000 },
      { label: 'día', seconds: 86400 },
      { label: 'hora', seconds: 3600 },
      { label: 'minuto', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count > 0) {
        return `hace ${count} ${interval.label}${count > 1 ? 's' : ''}`;
      }
    }
    return 'justo ahora';
  };

  return (
    <AuthenticatedLayout
      header={<h2 className="font-semibold leading-tight">Seguidos</h2>}
      subnav={<HomeSubnav />}
    >
      <Head title="Seguidos" />
      <div className="container mx-auto p-4">

        {posts.length === 0 ? (
          <p className="text-white">No sigues a nadie aún.</p>
        ) : (
          <div className="flex flex-col items-center"> {/* Elimina max-w-3xl y centra */}
            {posts.map((post, index) => (
              <div
                key={`${post.post_type}-${post.id}`}
                className={`space-y-2 w-auto py-8 ${index !== posts.length - 1 ? 'border-b border-purple-600' : ''}`}
              >
                <div className="flex justify-center w-auto">
                  <div className="bg-white/10 rounded-xl shadow-2xl shadow-black p-8 transition-colors max-w-2xl w-full mx-auto"> {/* max-w-2xl, p-8, rounded-xl */}
                    {/* Usuario y perfil */}
                    <div className="flex items-center space-x-4 px-6 mb-6">
                      <a
                        href={route('users.show', post.post.user.id)}
                        className="flex items-center space-x-4 group"
                      >
                        {post.post.user.profile_image ? (
                          <img
                            src={post.post.user.profile_image.path_small}
                            alt={`${post.post.user.name} perfil`}
                            className="w-14 h-14 rounded-full object-cover border-2 border-transparent group-hover:border-purple-400 transition"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-xl">
                            ?
                          </div>
                        )}
                        <span className="text-white font-semibold text-lg group-hover:underline">
                          {post.post.user.name}
                        </span>
                      </a>
                      <span className="text-purple-400 text-base ml-auto">{timeAgo(post.post.created_at)}</span>
                    </div>

                    {/* Post */}
                    <Post
                      post={post}
                      tags={tags}
                      isLikedByUser={post.isLikedByUser}
                      getTotalLikes={post.getTotalLikes}
                      isSharedByUser={post.isSharedByUser}
                      getTotalShares={post.getTotalShares}
                      postType={post.post_type}
                      className="shadow-none text-xl"
                    />

                    {/* Campo para comentarios */}
                    <div className="px-6">
                      <textarea
                        ref={(el) => (textareaRefs.current[post.id] = el)}
                        rows={1}
                        className="w-full h-12 border-none rounded-lg p-3 mt-4 text-lg resize-none overflow-hidden bg-[#373841] text-white"
                        placeholder="Escribe un comentario..."
                        value={comments[post.id] || ''}
                        onChange={(e) => handleCommentChange(post.id, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(post.id, e)}
                      />
                    </div>
                  </div>
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
