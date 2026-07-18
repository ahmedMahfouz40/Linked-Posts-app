import { lazy, Suspense, useContext } from "react";
import useGet from "../../CustomHooks/useGetPosts";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import NoPosts from "../NoPosts/NoPosts";
import AuthContext from "../../Contexts/AuthContext/authContext";

const PostCard = lazy(() => import("../Posts/PostCard"));

const MyPosts = () => {
  const { profileData } = useContext(AuthContext);

  const { data, isLoading } = useGet(
    ["userPosts", profileData?._id],
    `users/${profileData?._id}/posts`,
    Boolean(profileData?._id),
  );

  const posts = data?.data?.data?.posts;

  if (isLoading) return <LoadingSkeleton />;
  if (posts?.length === 0) return <NoPosts />;

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      {posts.map((post) => (
        <PostCard post={post} key={post._id} />
      ))}
    </Suspense>
  );
};

export default MyPosts;