import React, { useState, useContext, useEffect } from "react";
import "../style/CenterBar.css";
import Post from "./Post";
import { PermMedia , EmojiEmotions } from "@material-ui/icons";
import { PostContext } from "../context/PostContext";
import axios from "../utils/axios";
import { useSnackbar } from "notistack";
import { UserContext } from "../context/UserContext";
import Emoji from "./Emoji";
export default function CenterBar() {
  const { postState, postDispatch } = useContext(PostContext);
  const { userState } = useContext(UserContext);
  const [emoji, setEmoji] = useState(false);
  const [post, setPost] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState(null);
  const handleEmoji = (emoji) => {
    setPost((prev) => prev + emoji);
  };
  async function getAllPost() {
    try {
      const { data } = await axios.get("/Social-Hunt/api/post/getUserPost");

      postDispatch({ type: "POSTS_LOADED", payload: data });
    } catch (err) {
      console.log(err);
    }
  }
  const handlePost = async (ev) => {
    ev.preventDefault();
    if (file) {
      const fileData = new FormData();
      var fileName = file.name;
      fileData.append("profile", file);
      fileData.append("name", fileName);
      try {
        await axios.post("/Social-Hunt/api/user/upload", fileData);
      } catch (err) {
        console.log(err);
      }
    }
    var profileImage;
    if(fileName === undefined){
      profileImage = "";
    }else{
      profileImage = `https://iaagam.com/Social-Hunt/images/${fileName}`;
    }
    try {
      if ((post === "") && (fileName === undefined )) {
        return enqueueSnackbar("Empty Post", { variant: "error" });
      }
      await axios.post(`/Socail-Hunt/api/post`, {
        content: post,
        image: profileImage,
      });
      enqueueSnackbar("Posted Successfully", { variant: "success" });
      setPost("");
      setFile(null);
      getAllPost();
    } catch (err) {
      console.log(err);
    }
  };
  const openClose = () => {
    if (!emoji) {
      setEmoji(true);
    } else {
      setEmoji(false);
    }
  };

  const handleChangeInput = (ev) => {
    setFile(ev.target.files[0]);
    // setShowImage(true);
  };

  useEffect(() => {
    getAllPost();
    return () => {
      postDispatch({ type: "POST_UNLOADED" });
      postDispatch({ type: "POSTS_UNLOADED" });
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="CenterBar">
      <div className="centerWrapper">
        <div className="share" style={{ background: "white" }}>
          <div className="shareWrapper">
            <div className="shareTop">
              <img
                className="shareProfileImg"
                src={userState.user?.image}
                alt=""
              />
              <input
                type="text"
                className="shareInput"
                placeholder="What is in your mind"
                onChange={(ev) => setPost(ev.target.value)}
                value={post}
              ></input>
            </div>
            <span className="badge badge-pill badge-secondary">{file?.name}</span>

            <hr className="hr" />
            <div className="shareBottom">
              <div className="option">
                <div className="options">
                  <label htmlFor="file" className="options">
                    <PermMedia htmlColor="tomato" className="icon" />
                    <input
                      type="file"
                      id="file"
                      accept=".png,.jpeg,.jpg"
                      onChange={handleChangeInput}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
                <div className="options">
                  <EmojiEmotions
                    htmlColor="goldenrod"
                    className="icon"
                    onClick={openClose}
                  />
                </div>
              </div>
              <button
                className="postButton"
                onClick={handlePost}
                style={{ fontWeight: "bold" }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
        {emoji && <Emoji handleEmoji={handleEmoji} />}
        {postState?.posts?.length > 0 ? (
          postState?.posts?.slice(0).map((post) => {
            return <Post post={post} key={post?._id} />;
          })
        ) : (
          <div className="noPost">Follow People to See Their Post Here</div>
        )}
      </div>
    </div>
  );
}
