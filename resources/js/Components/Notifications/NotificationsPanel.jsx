import React from "react";
import FollowNotification from "./FollowNotification";
import LikeNotification from "./LikeNotification";
import ShareNotification from "./ShareNotification";

export default function NotificationsPanel({ notifications, openPostModal }) {
    console.log('notificaciones', notifications);
  return (
    <div className="max-w-5xl mx-auto p-4 bg-[#18191C] min-h-screen text-white overflow-y-auto">
      <h1 className="text-3xl font-semibold mb-8">Notificaciones</h1>



      <ul>
        {notifications.map((n) => (
          <li
            key={n.id}
            className={`mb-3 p-4 rounded-lg shadow-md border ${
              n.read_at
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-800 border-purple-600"
            }`}
          >
            {n.type === "follow" && (
              <FollowNotification
                follower={n.follower}
              />
            )}

            {n.type === "like" && (
              <LikeNotification
                liker={n.liker}
                post={n.post}
                openPostModal={openPostModal} // PASAMOS LA FUNCIÓN HACIA ABAJO
              />
            )}

            {n.type === "share" && (
              <ShareNotification
                sharer={n.sharer}
                post={n.post}
                openPostModal={openPostModal} // PASAMOS LA FUNCIÓN HACIA ABAJO
              />
            )}

            {/* Otras notificaciones aquí... */}
          </li>
        ))}
      </ul>
    </div>
  );
}
