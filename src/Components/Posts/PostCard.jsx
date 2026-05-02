import React, { useCallback, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import headerObject from "../../utils/headerObject";
import DeleteModal from "../DeleteModal/DeleteModal";
import PostHeader from "./PostHeader";
import PostShared from "./PostShared";
import PostImage from "./PostImage";
import PostReactions from "./PostReactions";
import Comments from "../Comments/Comments";
import TopComment from "../Comments/TopComment";

function deletePost(postId) {
  return axios.delete(
    `https://route-posts.routemisr.com/posts/${postId}`,
    headerObject(),
  );
}

const PostCard = ({ post, isDetails }) => {
  const { image: postImage, id: postId } = post;
  const [clickComment, setClickComment] = useState(false);

  const queryClient = useQueryClient();
  const modalId = useMemo(() => `delete_modal_${postId}`, [postId]);

  const { mutate: deletePostFn } = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: (res) => {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["postDetails", postId]);
    },
    onError: () => toast.error("Post not deleted"),
  });

  const handleDelete = useCallback(() => deletePostFn(), [deletePostFn]);

  return (
    <>
      <DeleteModal modalId={modalId} onConfirm={handleDelete} />

      <div className="bg-white shadow-xl rounded-2xl my-5">
        <PostHeader post={post} />
        {post?.isShare && <PostShared post={post} />}
        <PostImage postImage={postImage} />
        <PostReactions
          post={post}
          isDetails={isDetails}
          setClickComment={setClickComment}
        />
        {clickComment ? (
          <Comments post={post} />
        ) : (
          post?.topComment && (
            <TopComment
              setClickComment={setClickComment}
              clickComment={clickComment}
              comment={post.topComment}
            />
          )
        )}
      </div>
    </>
  );
};

export default React.memo(PostCard);
