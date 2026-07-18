import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import getHeaderObject from "../../utils/headerObject";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "react-toastify";

function markAllRead() {
  return axios.patch(
    "https://route-posts.routemisr.com/notifications/read-all",
    null,
    getHeaderObject(),
  );
}
const NotificationsHeader = ({ unreadCount, activeTab, setActiveTab }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["unred"]); // 👈 also update the unread count badge
    },
    onError() {
      toast.error("error during mark all notifications as read");
    },
  });

  return (
    <div>
      <div className="border-b border-slate-200 p-4 sm:p-5 dark:border-slate-700">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 sm:text-2xl dark:text-white">
              Notifications
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Realtime updates for likes, comments, shares, and follows.
            </p>
          </div>
          <button
            disabled={unreadCount === 0 || isPending}
            onClick={mutate}
            className={`${unreadCount === 0 && "cursor-not-allowed opacity-60"} inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700`}
          >
            <FontAwesomeIcon icon={faCheck} />
            Mark all as read
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${activeTab === "all" ? "bg-[#1877f2] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"}`}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("unread")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold transition ${activeTab === "unread" ? "bg-[#1877f2] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"}`}
          >
            Unread
            <span className="rounded-full px-2 py-0.5 text-xs bg-white text-[#1877f2] dark:bg-slate-900 dark:text-[#63b3ff]">
              {unreadCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(NotificationsHeader);