import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Page from "./Page";
import Axios from "axios";
import DispatchContent from "../DispatchContext";
import StateContent from "../StateContext";

const CreatePost = props => {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const navigate = useNavigate(); // allows for the redirection to another url
  const appDispatch = useContext(DispatchContent);
  const appState = useContext(StateContent);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      /*
      using the axios libary to send a post request to the "MangoDB" database

       "/create-post" -- is the action that should be taken

       { title, body, token } -- refers to the data that is sent to the server ( title & body -- are the names of the states as created in lines 6 - 7 )

       token: appState.user.token -- this ensures that the database accepts the request from a user that is on the database
       
    */
      const response = await Axios.post("/create-post", { title, body, token: appState.user.token });

      appDispatch({ type: "flashMessage", value: "Congrats, you successfully created a post." });

      /* 
        Redirects to the url of the new post that was created. 
        
        ${response.data} -- is the id of the new post
      */
      navigate(`/post/${response.data}`);
      console.log("New post was created.");
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <Page title="Create New Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onChange={e => setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={e => setBody(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  );
};

export default CreatePost;
