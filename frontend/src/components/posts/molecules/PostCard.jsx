import React, { useState } from "react";
import Api from "../../../api/Api";
import { useHistory, useLocation } from 'react-router-dom';
import ChatApi from '../../../api/ChatApi';
import { Link } from "react-router-dom";
import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa";

//PostCard displays a post in a listing of posts on PostsPage.

//The code below should be worked through. What information should be displayed on
//PostCard? Shall tags "Available"/"Claimed" stay as they are or are we changing that?
function PostCard({ post }) {
  const [reaction, setReaction] = useState(post.reaction);
  const receiverEmail = window.sessionStorage.getItem('userEmail');
  console.log(receiverEmail);
  const history = useHistory();
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

  const threadHandler = () => {
    const createOrDirect = async () => {
      try {
        const response = await ChatApi.createThread(receiverEmail, {});
        console.log(response);
        const thread = response.data;
        history.push({ pathname: `/chat/${thread.id}`, state: { thread } });
      } catch (e) {
        console.log(e);
      }
    };
    createOrDirect();
  };

  return (
    <div className="postcard">
      <Link to={{ pathname: `/posts/${post.id}`, state: { post } }}>
        <img
          className="post-image"
          // className={post.claimed ? "claimed pic-1" : "pic-1"}
          src={post.imageUrl}
          alt=""
        />
      </Link>

      <div className="post-bottom">
        {/* Header includes post title and type(giving or requesting) */}
        <div className="header">
          <h3 className="title">{post.title}</h3>
          <span className="type-tag">{post.postType}</span>
          {/* Uncomment when Hassan fixes type for posts */}
          {/* <span>{post.type}</span> */}
        </div>
        {/* Post body */}
        <p className="post-text">{post.body}</p>
        {/* Signature includes post status and date */}
        <div className="signature">
          {post.claimed ? (
            <span className="small-button">Claimed</span>
          ) : (
            <span className="small-button">Available</span>
          )}
          <span className="post-date">{post.date}</span>
        </div>
        <hr />
        {/* React container includes reactions and link to the post details */}
        <div className="react">
          <div className="reaction">
            <button onClick={incrementLike}>
              <FaLongArrowAltUp className="up" />
              <span>{reaction.like}</span>

              {/* <i className="fas fa-thumbs-up"></i> {reaction.like} */}
            </button>
            <button onClick={incrementDislike}>
              <FaLongArrowAltDown className="down" />
              <span>{reaction.dislike}</span>

              {/* <i className="fas fa-thumbs-down"></i> {reaction.dislike} */}
            </button>
          </div>

          <Link
            className="medium-button"
            to={{ pathname: `/posts/${post.id}`, state: { post } }}
          >
            View post
          </Link>

          <div>
          <button onClick={threadHandler} type="submit">
            <i className="fa fa-paper-plane" aria-hidden="true"></i>
          </button>
           </div>

        </div>
        <hr />
        {/* Once View Post button is clicked by user, user is redirected to 
          the SinglePost page where all the details about the post are specified.
          */}
      </div>
    </div>
  );
}

export default PostCard;
