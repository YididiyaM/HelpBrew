import React, { useState, useEffect } from 'react';
import CommentUpdateForm from './CommentUpdateForm';
import Api from "../../api/Api";

function CommentCard({ comment, onDeleteClick, onUpdateClick }) {

  const [isUpdating, setIsUpdating] = useState(false);
  const [reaction, setReaction] = useState(comment.reaction);
  const [name, setName] = useState("");

  useEffect(() => {
    Api.get("/user/")
      .then(response => {
        const name = response.data
        setName(name);
      });
  }, []);



  const handleUpdateClick = () => {
    setIsUpdating(true);
  };

  const incrementLike = () => {
    const url = "/reactions/" + reaction.id + "?incrementTarget=like";
    Api.put(url, reaction).then((r) => {
      setReaction(r.data);
    });
  };

  const incrementDislike = () => {
    const url = "/reactions/" + reaction.id + "?incrementTarget=dislike";
    Api.put(url, reaction).then((r) => {
      setReaction(r.data);
    });
  };

  return isUpdating ? (
    <CommentUpdateForm
      oldComment={comment}
      onUpdateClick={onUpdateClick}
      setIsUpdating={setIsUpdating}
    />
  ) : (
      <div>
        <h5>{comment.authorName}</h5>
        <h4>{comment.body}</h4>
        <h4>{comment.authorName}</h4>
        <div >
          <button onClick={incrementLike}>
            <i ></i> {reaction.like}
          </button>
          <button onClick={incrementDislike}>
            <i ></i> {reaction.dislike}
          </button>
        </div>

        {(comment.authorName === name) ?
          <div>
            <button onClick={() => onDeleteClick(comment.id)}>
              Delete
            </button>

            <button onClick={handleUpdateClick}>
              Update
            </button>
          </div>
          : null}

      </div>
    );
}

export default CommentCard;
