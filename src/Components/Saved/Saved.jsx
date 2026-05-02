import React, { useContext } from "react";
import PostCard from "../Posts/PostCard";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import AuthContext from "../../AuthContext/authContext";
import useGet from "../../CustomHooks/useGetPosts";
import NoPosts from "../NoPosts/NoPosts";

const Saved = () => {
  const { profileData } = useContext(AuthContext);
  const { data: bookmarksData, isLoading: isSaving } = useGet(
    ["bookmarks"],
    "users/bookmarks",
    Boolean(profileData?._id),
  );
  const bookmarks = bookmarksData?.data?.data?.bookmarks;
  if (isSaving) return <LoadingSkeleton />;
  if (bookmarks.length === 0) return <NoPosts />;

  return (
    <>
      {bookmarks?.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </>
  );
};

export default Saved;
