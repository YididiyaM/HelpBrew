import React, { useEffect, useState } from "react";
import NewCommentForm from "../organisms/NewCommentForm";
import CommentCard from "../molecules/CommentCard";
import Api from "../../../api/Api";
import CommentApi from "../../../api/CommentApi";

export default function Comments({ post }) {
  const [comments, setComments] = useState([]);

  const getAllByPost = () => {
    CommentApi.getAllCommentsByPost(post.id).then((comments) =>
      setComments(comments)
    );
  };

  useEffect(() => {
    getAllByPost();
  }, []);

  const createComment = (commentData) => {
    Api.post("/comments", commentData).then((response) => {
      console.log(response.data);
      setComments([...comments, response.data]);
    });
  };

  const deleteComment = (id) => {
    Api.delete("/comments/" + id).then((response) => getAllByPost());
  };

  const updateComment = (updatedComment) => {
    Api.put("/comments", updatedComment).then((r) => getAllByPost(post));
  };

  return (
    <div className="comments-wrapper">
      <h3>Comments</h3>

      {comments.length > 0 ? (
        <div className="comments">
          {comments.map((comment) => (
            <CommentCard
              comment={comment}
              key={comment.id}
              onUpdateClick={updateComment}
              onDeleteClick={deleteComment}
            />
          ))}
        </div>
      ) : (
        <p className="no-comments">No one commented this post yet</p>
      )}
      <NewCommentForm onSubmit={createComment} post={post} />
    </div>
  );
}
