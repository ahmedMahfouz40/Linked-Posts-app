import React, { useState } from "react";
import PostCard from "../../Components/Posts/PostCard";
import LoadingSkeleton from "../../Components/LoadingSkeleton/LoadingSkeleton";
import PostsToggle from "./PostsToggle";

const ProfileDisplaying = ({ posts, bookmarks, isSaving, isPosting }) => {
  const [toggleHeader, setToggle] = useState("myPosts");

  return (
    <section className="mt-5 space-y-3">
      <PostsToggle
        setToggle={setToggle}
        toggleHeader={toggleHeader}
        postsCount={posts?.length}
        savedCount={bookmarks?.length}
      />

      {isSaving || isPosting ? (
        <LoadingSkeleton />
      ) : (
        <>
          {toggleHeader === "myPosts" && (
            !posts?.length
              ? <p className="text-center text-gray-400 mt-10">No posts yet.</p>
              : posts.map((post) => <PostCard post={post} key={post._id} />)
          )}
          {toggleHeader === "saved" && (
            !bookmarks?.length
              ? <p className="text-center text-gray-400 mt-10">No saved posts yet.</p>
              : bookmarks.map((post) => <PostCard post={post} key={post._id} />)
          )}
        </>
      )}
    </section>
  );
};

export default React.memo(ProfileDisplaying);