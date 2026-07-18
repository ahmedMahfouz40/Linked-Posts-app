import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import headerObject from "../../utils/headerObject";
import useGet from "../../CustomHooks/useGetPosts";
import AllComments from "./AllComments";
import CreateComment from "./CreateComment";
import CommentHeader from "./CommentHeader";
import CommentSkeleton from "../LoadingSkeleton/CommentSkeleton";
import NoComments from "./NoComments";

function likeComment(postId, commentId) {
  return axios.put(
    `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/like`,
    null,
    headerObject(),
  );
}

const Comments = ({ post }) => {
  const [pendingCommentId, setPendingCommentId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading: commentFetching } = useGet(
    ["postComments", post._id],
    `posts/${post._id}/comments?page=1&limit=10`,
    Boolean(post._id),
  );
  const postComments = data?.data?.data?.comments;

  const { mutate: likeCommentFn } = useMutation({
    mutationFn: (commentId) => {
      setPendingCommentId(commentId);
      return likeComment(post._id, commentId);
    },
    onSettled: () => setPendingCommentId(null),
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries( ["postComments", post._id] );
    },
    onError: () => toast.error("Failed to like comment"),
  });

  return (
    <div className="py-2">
      <CommentHeader post={post} />
      {commentFetching ? (
        <CommentSkeleton />
      ) : postComments?.length === 0 ? (
        <NoComments />
      ) : (
        postComments?.map((comment) => (
          <AllComments
            key={comment._id}
            comment={comment}
            post={post}
            likeCommentFn={likeCommentFn}
            isPending={pendingCommentId === comment._id}
          />
        ))
      )}
      <CreateComment post={post} />
    </div>
  );
};

export default React.memo(Comments);