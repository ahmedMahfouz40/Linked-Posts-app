
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import headerObject from "../../utils/headerObject";
import useGet from "../../CustomHooks/useGetPosts";
import NotificationsHeader from "./NotificationsHeader";
import NotificationItem from "./NotificationItem";
import NotificationItemSkeleton from "../../Components/LoadingSkeleton/NotificationItemSkeleton";

function markAsRead(id) {
  return axios.patch(
    `https://route-posts.routemisr.com/notifications/${id}/read`,
    {},
    headerObject()
  );
}

const Notifications = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [pendingId, setPendingId] = useState(null);

  const { data: notificationsData, isLoading } = useGet(
    ["notifications"],
    "notifications?all=true&page=1&limit=20",
    true,
    1000 * 60 * 60 * 24
  );

  const notifications = notificationsData?.data?.data?.notifications;
  const unreadNotifications = notifications?.filter((n) => !n.isRead);
  const displayedNotifications =
    activeTab === "all" ? notifications : unreadNotifications;

  const { mutate: markAsReadFn } = useMutation({
    mutationFn: markAsRead,
    onMutate: async (id) => {
      setPendingId(id);
      await queryClient.cancelQueries( ["notifications"] );
      const previousNotifications = queryClient.getQueryData(["notifications"]);

      queryClient.setQueryData(["notifications"], (oldData) => ({
        ...oldData,
        data: {
          ...oldData.data,
          data: {
            ...oldData.data.data,
            notifications: oldData.data.data.notifications.map((n) =>
              n._id === id ? { ...n, isRead: true } : n
            ),
          },
        },
      }));

      return { previousNotifications };
    },
    onSuccess: () => {
      queryClient.invalidateQueries( ["notifications"] );
    },
    onError: (err, _variables, context) => {
      queryClient.setQueryData(["notifications"], context.previousNotifications);
      toast.error(err?.response?.data?.message ?? "Failed to mark as read");
    },
    onSettled: () => setPendingId(null),
  });

  return (
    <>
      <Helmet>
        <title>Notifications | Lucky Posts</title>
      </Helmet>
      <div className="p-1 bg-[#F0F2F5] sm:px-5 md:px-10 lg:px-20 dark:bg-slate-950 min-h-screen">
        <div className="bg-white my-20 rounded-2xl dark:bg-slate-900">
          <NotificationsHeader
            unreadCount={unreadNotifications?.length || 0}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <div className="px-5">
            {isLoading ? (
              <NotificationItemSkeleton />
            ) : (
              displayedNotifications?.map((item) => (
                <NotificationItem
                  key={item._id}
                  notification={item}
                  markAsReadFn={markAsReadFn}
                  pendingId={pendingId}
                />
              ))
            )}

            {activeTab !== "all" && unreadNotifications?.length === 0 && (
              <div className="space-y-2 p-3 sm:p-4  h-[50vh] ">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    No unread notifications yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;