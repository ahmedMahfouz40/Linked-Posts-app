import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import useGet from "../../CustomHooks/useGetPosts";
import PostCard from "../../Components/Posts/PostCard";
import LoadingSkeleton from "../../Components/LoadingSkeleton/LoadingSkeleton";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading } = useGet(
    ["postDetails", id],
    `posts/${id}`,
    Boolean(id),
  );

  const post = data?.data?.data?.post;

  const pageTitle = post?.body
    ? `${post.body.slice(0, 50)}${post.body.length > 50 ? "..." : ""}`
    : "Post Details";

  const handleBack = useCallback(() => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/feed");
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>
          {post?.body
            ? `${pageTitle} | Route Posts`
            : "Post Details | Route Posts"}
        </title>
      </Helmet>
      <div className="bg-[#F0F2F5]">
        <div className="max-w-[95%] md:max-w-[90%] xl:max-w-[80%] mx-auto my-10">
          <button
            onClick={handleBack}
            className="mt-10 cursor-pointer rounded-lg bg-white px-4 py-2 hover:bg-slate-200 transition"
          >
            ← Back
          </button>
          {isLoading ? (
            <LoadingSkeleton />
          ) : !post ? (
            <p className="text-center text-gray-400 mt-10">Post not found.</p>
          ) : (
            <PostCard post={post} isDetails={true} />
          )}
        </div>
      </div>
    </>
  );
};

export default PostDetails;
