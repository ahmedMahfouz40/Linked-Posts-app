import {
  faCheck, faDotCircle, faMessage,
  faThumbsUp, faShare, faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import React, { useCallback } from "react";
import timeAgoShort from "../../utils/timeAgo";

function getIcon(type) {
  switch (type) {
    case "like_post":    return faThumbsUp;
    case "comment_post": return faMessage;
    case "share_post":   return faShare;
    case "follow_user":  return faUserPlus;
    default:             return faDotCircle;
  }
}

function getActionText(type) {
  switch (type) {
    case "follow_user":  return " Started Following You";
    case "comment_post": return " Commented on Your Post";
    case "share_post":   return " Shared Your Post";
    case "like_post":    return " Liked Your Post";
    default:             return "";
  }
}

const NotificationItem = ({ notification, markAsReadFn, pendingId }) => {
  const navigate = useNavigate();
  const { _id: actorId, photo: actorPhoto, name: actorName } = notification?.actor || {};
  const isPending = pendingId === notification._id;

  const handleMarkAsRead = useCallback((e) => {
    e.stopPropagation();
    if (!notification.isRead) markAsReadFn(notification._id);
  }, [markAsReadFn, notification._id, notification.isRead]);

  const handleCardClick = useCallback(() => {
    if (!notification.isRead) markAsReadFn(notification._id);
    navigate(`/postDetails/${notification.entityId}`);
  }, [markAsReadFn, notification._id, notification.entityId, notification.isRead, navigate]);

  return (
    <div
      onClick={handleCardClick}
      className={`group my-5 relative flex gap-3 rounded-xl border p-3 transition sm:rounded-2xl sm:p-4 border-[#dbeafe] ${
        notification.isRead ? "bg-white" : "bg-[#edf4ff]"
      }`}
    >
      {/* Actor photo + type icon */}
      <div className="relative shrink-0">
        <Link
          to={`/profile/${actorId}`}
          className="hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={actorPhoto}
            alt={actorName}
            className="h-11 w-11 rounded-full object-cover"
          />
        </Link>
        <span className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-white text-[#1877f2]">
          <FontAwesomeIcon icon={getIcon(notification?.type)} />
        </span>
      </div>

      {/* Content */}
      <div className="flex justify-between w-full items-center">
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-6 text-slate-800">
            <Link
              to={`/profile/${actorId}`}
              className="hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-extrabold">{actorName}</span>
            </Link>
            {getActionText(notification?.type)}
          </p>

          <p className="mt-0.5 text-sm text-slate-600">
            {notification?.entity?.body}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <button
              disabled={isPending || notification.isRead}
              onClick={handleMarkAsRead}
              className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-[#1877f2] ring-1 ring-[#dbeafe] transition hover:bg-[#e7f3ff] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FontAwesomeIcon icon={faCheck} />
              {notification.isRead ? "Read" : "Mark as read"}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-semibold text-slate-500">
            {timeAgoShort(notification?.createdAt)}
          </span>
          {!notification.isRead && (
            <FontAwesomeIcon icon={faDotCircle} className="text-[#1877f2]" />
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(NotificationItem);