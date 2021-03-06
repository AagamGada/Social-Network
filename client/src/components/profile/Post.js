import React, { useState, useContext, useEffect } from "react";
import "../../style/Post.css";
import { Favorite } from "@material-ui/icons";
import { PostContext } from "../../context/PostContext";
import { UserContext } from "../../context/UserContext";
import axios from "../../utils/axios";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import LikesCard from "../LikesCard";
export default function Post(props) {
  const { postDispatch } = useContext(PostContext);
  const { userState } = useContext(UserContext);
  const [allComments, setAllComments] = useState(0);
  const [dropDown, setDropDown] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [comment, setComment] = useState("");
  const [isLike, setIsLike] = useState(false);
  const [allLikes, setAllLikes] = useState([]);
  const [showLikes, setShowLikes] = useState(false);
  async function getPersonalPost() {
    try {
      const { data } = await axios.get("/Social-Hunt/api/post/personalPost");
      postDispatch({ type: "POSTS_LOADED", payload: data });
    } catch (err) {
      console.log(err);
    }
  }
  async function getAllComments() {
    try {
      const { data } = await axios.get(`/Social-Hunt/api/comment/${props.post._id}`);
      postDispatch({ type: "COMMENTS_LOADED", payload: data });
      setAllComments(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function getAllLikes() {
    try {
      const { data } = await axios.get(`/Social-Hunt/api/post/getlikes/${props.post._id}`);
      setAllLikes([data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleComment = async (ev) => {
    ev.preventDefault();
    try {
      if (comment === "") {
        return enqueueSnackbar("Empty Comment", { variant: "error" });
      }
      const { data } = await axios.post(`/Social-Hunt/api/comment/${props.post._id}`, {
        comment: comment,
      });
      postDispatch({ type: "POST_COMMENTS", payload: data });
      getAllComments();
      enqueueSnackbar("Posted Successfully", { variant: "success" });
    } catch (err) {
      console.log(err);
    }
  };
  const handleLike = async (ev) => {
    ev.preventDefault();
    try {
      const { data } = await axios.put(`/Social-Hunt/api/post/likes/${props.post._id}`);
      postDispatch({ type: "POST_LOADED", payload: data });
      setIsLike(true);
      let result = props.post?.likes.filter(
        (item) => item.user === userState.user?._id
      );
      if (result.length !== 0) {
        setIsLike(false);
      }
      getPersonalPost();
      getAllLikes();
    } catch (err) {
      console.log(err);
    }
  };
  const deletePost = async (ev) => {
    ev.preventDefault();
    try {
      await axios.delete(`/Social-Hunt/api/post/${props.post._id}`);
      getPersonalPost();
    } catch (err) {
      console.log(err);
    }
  };
  const openDropDown = () => {
    if (!dropDown) {
      setDropDown(true);
    } else {
      setDropDown(false);
    }
  };
  useEffect(() => {
    var mounted = true;
    async function getAllComments() {
      try {
        const { data } = await axios.get(`/Social-Hunt/api/comment/${props.post._id}`);
        if (mounted) {
          postDispatch({ type: "COMMENTS_LOADED", payload: data });
          setAllComments(data);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getAllComments();
    async function getAllLikes() {
      try {
        const { data } = await axios.get(`/Social-Hunt/api/post/getlikes/${props.post._id}`);
        if (mounted) {
        setAllLikes([data]);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getAllLikes();
    return () => {
      postDispatch({ type: "COMMENTS_UNLOADED" });
      mounted = false;
    };
    // eslint-disable-next-line
  }, []);
  let month = new Date(props.post?.createdAt).toLocaleString("default", {
    month: "short",
  });
  let result = props.post?.likes.filter(
    (item) => item.user === userState.user?._id
  );
  let red =
    result?.length !== 0 || isLike
      ? { htmlColor: "red" }
      : { htmlColor: "grey" };
  let day = new Date(props.post?.createdAt).getDate();
  return (
    <div className="post" style={{ background: "white" }}>
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img className="postTopImg" src={userState.user?.image} alt="" />
            <span className="postUser">{props.post?.user?.name}</span>
            <span className="postDate">{`${month} ${day}`}</span>
          </div>
          <div className="postTopRight">
            <i
              className="fas fa-ellipsis-v"
              onClick={openDropDown}
              style={{ cursor: "pointer" }}
            >
              {dropDown && (
                <div className="dropDown">
                  <ul>
                    <li onClick={deletePost}>Delete</li>
                  </ul>
                </div>
              )}
            </i>
          </div>
        </div>
        <div className="postCenter">
          <span className="text">{props.post?.content}</span>
          {props.post?.image && (
            <img src={props.post?.image} alt="" className="postImg" />
          )}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <Favorite {...red} className="likeIcon" onClick={handleLike} />
            <span
              className="postLikeCounter"
              onClick={() => {
                setShowLikes(true);
              }}
              style={{ cursor: "pointer" }}
            >
              {props.post?.likes.length} Likes
            </span>
          </div>
          {showLikes && (
            <LikesCard allLikes={allLikes} setShowLikes={setShowLikes} />
          )}

          <div className="postBottomRight">
            <Link to={`/post/${props.post?._id}`}>
              <span className="postCommentText">
                {allComments?.length} comments
              </span>
            </Link>
          </div>
        </div>
        <div className="comments">
          <input
            type="text"
            value={comment}
            className="postComment"
            placeholder="Add a comment.."
            onChange={(ev) => setComment(ev.target.value)}
          ></input>
          <button
            variant="contained"
            className="commentButton"
            onClick={handleComment}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
