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
          <div className="flex flex-col max-w-xl mx-auto">
            {posts.map((post, index) => (
              <div
                key={`${post.post_type}-${post.id}`}
                className={`space-y-2 w-full py-8 ${index !== posts.length - 1 ? 'border-b border-purple-600' : ''}`}
              >
                <div className="flex justify-center w-auto">
                  <div className="bg-white/10 rounded-xl shadow-2xl shadow-black p-4 transition-colors max-w-lg mx-auto">
                    {/* Usuario y perfil */}
                    <div className="flex items-center space-x-3 px-4 mb-4">
                      <a
                        href={route('users.show', post.post.user.id)}
                        className="flex items-center space-x-3 group"
                      >
                        {post.post.user.profile_image ? (
                          <img
                            src={post.post.user.profile_image.path_small}
                            alt={`${post.post.user.name} perfil`}
                            className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-purple-400 transition"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-lg">
                            ?
                          </div>
                        )}
                        <span className="text-white font-semibold group-hover:underline">
                          {post.post.user.name}
                        </span>
                      </a>
                      <span className="text-purple-400 text-sm ml-auto">{timeAgo(post.post.created_at)}</span>
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
                      className="shadow-none"
                    />

                    {/* Campo para comentarios */}
                    <div className="px-4">
                      <textarea
                        ref={(el) => (textareaRefs.current[post.id] = el)}
                        rows={1}
                        className="w-full h-10 border-none rounded-md p-2 mt-2 text-base resize-none overflow-hidden bg-[#373841] text-white"
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
