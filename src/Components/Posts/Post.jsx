import { lazy, Suspense } from "react";
import useGet from "../../CustomHooks/useGetPosts";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import NoPosts from "../NoPosts/NoPosts";
const PostCard = lazy(() => import("./PostCard"));
export default function Post() {
  const { data, isLoading } = useGet(["posts"], "posts", true);
  const posts = data?.data?.data.posts;
  if (isLoading) return <LoadingSkeleton />;
  if (posts?.length === 0) return <NoPosts />;

  return (
    <>
      {posts?.map((post) => (
        <Suspense fallback={<LoadingSkeleton />}>
          <PostCard key={post._id} post={post} />
        </Suspense>
      ))}
    </>
  );
}
