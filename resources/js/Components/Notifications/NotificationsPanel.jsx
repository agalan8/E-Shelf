import React, { useState } from "react";
import FollowNotification from "./FollowNotification";
import LikeNotification from "./LikeNotification";
import ShareNotification from "./ShareNotification";
import MentionNotification from "./MentionNotification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faRotateRight } from "@fortawesome/free-solid-svg-icons"; // Importa faArrowRight
import { router } from "@inertiajs/react";
import axios from "axios";

export default function NotificationsPanel({ notifications: initialNotifications, openPostModal }) {
  const [notifications, setNotifications] = useState(
    initialNotifications.map((n) => ({ ...n, isHiding: false }))
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (loading) return; // Evitar llamadas simultáneas
    setLoading(true);
    try {
      const offset = notifications.length;
      const res = await axios.get(`/notifications/more?offset=${offset}`);
      if (res.data.length === 0) {
        setHasMore(false);
      } else {
        setNotifications((prev) => [
          ...prev,
          ...res.data.map((n) => ({ ...n, isHiding: false })),
        ]);
      }
    } catch (error) {
      console.error("Error al cargar más notificaciones", error);
    }
    setLoading(false);
  };

  const markAsRead = (id) => {
    // Animación de ocultar
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isHiding: true } : n))
    );

    setTimeout(() => {
      router.post(
        `/notifications/${id}/destroy`,
        {},
        {
          preserveScroll: true,
          onSuccess: () => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
          },
        }
      );
    }, 300); // Duración de la animación
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-[#18191C] min-h-screen text-white overflow-y-auto">
      <h1 className="text-3xl font-semibold mb-8">Notificaciones</h1>
      <ul>
        {notifications.map((n) => (
          <li
            key={n.id}
            className={`
              mb-3 p-4 rounded-lg shadow-md border flex justify-between items-start
              transition-all duration-300 ease-in-out
              ${n.isHiding ? "opacity-0 scale-95" : "opacity-100 scale-100"}
              ${n.read_at ? "bg-gray-800 border-gray-700" : "bg-gray-800 border-purple-600"}
            `}
          >
            <div className="flex-grow">
              {n.type === "follow" && <FollowNotification follower={n.follower} />}
              {n.type === "like" && (
                <LikeNotification liker={n.liker} post={n.post} openPostModal={openPostModal} />
              )}
              {n.type === "share" && (
                <ShareNotification sharer={n.sharer} post={n.post} openPostModal={openPostModal} />
              )}
              {n.type === "mention" && (
                <MentionNotification mentioner={n.mentioner} post={n.post} openPostModal={openPostModal} />
              )}
            </div>
            {!n.read_at && (
              <button
                onClick={() => markAsRead(n.id)}
                className="ml-4 text-gray-400 hover:text-gray-200"
                title="Marcar como leído"
              >
                <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
              </button>
            )}
          </li>
        ))}
      </ul>

      {loading && <div className="text-center text-gray-400 py-4">Cargando más...</div>}

      {!loading && hasMore && (
        <div className="text-center mt-4">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition-colors"
            title="Cargar más"
          >
            <FontAwesomeIcon icon={faRotateRight} className="w-6 h-6" />
          </button>
        </div>
      )}

      {!hasMore && notifications.length === 0 && (
        <div className="text-center text-gray-600 py-4">No hay más notificaciones.</div>
      )}
    </div>
  );
}
