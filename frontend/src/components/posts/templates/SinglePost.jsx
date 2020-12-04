import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import ErrorScreen from "../../tempscreens/ErrorScreen";
import ChatApi from "../../../api/ChatApi";
import Comments from "../../comments/templates/Comments";
import PostUpdateForm from "./PostUpdateForm";
import Api from "../../../api/Api";
import SkillPost from "../organisms/SkillPost";
import GiveawayPost from "../organisms/GiveawayPost";
import MonetarySupportPost from "../organisms/MoneterySupportPost";
import { useNotification } from "../../notifications/NotificationProvider";

function SinglePost({ user }) {
  const { state } = useLocation();
  const passedPost = state === undefined ? null : state.post;
  const [post, setPost] = useState(passedPost);
  const history = useHistory();
  const [isUpdating, setIsUpdating] = useState(false);

  // const handleClaim = () => {
  //   const setClaimed = async () => {
  //     try {
  //       const response = await PostsApi.updatePost({
  //         ...post,
  //         claimed: !post.claimed,
  //       });
  //       setPost(response.data);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   setClaimed();
  // };

  // const messageHandler = () => {
  //   const createOrDirect = async () => {
  //     try {
  //       const response = await ChatApi.createThread(post.email, {});
  //       const thread = response.data;
  //       history.push({ pathname: `/chat/${thread.id}`, state: { thread } });
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   createOrDirect();
  // };

  const deletePost = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      Api.delete("/posts/" + post.id).then((res) => {
        history.push(`/posts/category/${post.category}`);
      });
    }
  };

  const updatePost = (updatedPost) => {
    Api.put("/posts", updatedPost).then((res) => setPost(res.data));
  };

  const handleUpdateClick = () => {
    setIsUpdating(true);
  };

  //getPost() function reads post variable passed as props and checks its category.
  //Depending on the category of the passed post a component relevant to that category is called.
  //This process is handled by the switch statement below.
  const getPost = () => {
    switch (post.category) {
      case "skills":
        return (
          <SkillPost
            post={post}
            handleUpdateClick={handleUpdateClick}
            deletePost={deletePost}
            user={user}
          />
        );
      case "giveaways":
        return (
          <GiveawayPost
            post={post}
            handleUpdateClick={handleUpdateClick}
            deletePost={deletePost}
            user={user}
          />
        );
      case "monetary-support":
        return (
          <MonetarySupportPost
            post={post}
            handleUpdateClick={handleUpdateClick}
            deletePost={deletePost}
            user={user}
          />
        );
      default:
        return null;
    }
  };

  try {
    //If user is updating text of the post, PostUpdateForm is displayed.
    return isUpdating ? (
      <PostUpdateForm
        oldPost={post}
        onUpdateClick={updatePost}
        setIsUpdating={setIsUpdating}
      />
    ) : (
      //Otherwise details of the post passed as props are displayed(managed by getPost() function above)
      //followed by comments to that post.
      <div>
        {getPost()}
        {/* <Comments post={post} /> */}
      </div>
    );
  } catch (e) {
    console.log(e);
    return <ErrorScreen />;
  }
}
export default SinglePost;
