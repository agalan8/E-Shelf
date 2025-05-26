import React from "react";
import FollowNotification from "./FollowNotification";
import LikeNotification from "./LikeNotification";
import ShareNotification from "./ShareNotification";

export default function NotificationsPanel({ notifications, openPostModal }) {
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
            {n.data.type === "follow" && (
              <FollowNotification
                followerName={n.data.follower_name}
                follower_profile_image={n.data.follower_profile_image}
                follower_id={n.data.follower_id}
              />
            )}

            {n.data.type === "like" && (
              <LikeNotification
                likerName={n.data.liker_name}
                liker_profile_image={n.data.liker_profile_image}
                liker_id={n.data.liker_id}
                post={n.data.post}
                openPostModal={openPostModal} // PASAMOS LA FUNCIÓN HACIA ABAJO
              />
            )}

            {n.data.type === "share" && (
              <ShareNotification
                sharerName={n.data.sharer_name}
                sharer_profile_image={n.data.sharer_profile_image}
                sharer_id={n.data.sharer_id}
                post={n.data.post}
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
