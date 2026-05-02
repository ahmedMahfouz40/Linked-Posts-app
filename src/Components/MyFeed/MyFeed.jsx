import React, { lazy, Suspense, useMemo } from "react";
import useGet from "../../CustomHooks/useGetPosts";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import NoPosts from "../NoPosts/NoPosts";
const PostCard = lazy(() => import("../Posts/PostCard"));
const MyFeed = () => {
  const isAuthenticated = useMemo(
    () => Boolean(localStorage.getItem("token")),
    [],
  );
  const { data, isLoading } = useGet(
    ["homefeed"],
    "posts/feed?only=following",
    isAuthenticated,
  );
  const posts = data?.data?.data?.posts;
  if (isLoading) return <LoadingSkeleton />;
  if (posts?.length===0) return <NoPosts />;

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      {posts?.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </Suspense>
  );
};

export default MyFeed;
