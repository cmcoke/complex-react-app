import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import NotFound from "./NotFound";

const EditPost = () => {
  const navigate = useNavigate();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  // the initial state
  const originalState = {
    title: {
      value: "", // the text value the user writes
      hasErrors: false, // if there is an error in regards to to the title (if it is empty) it will become true
      message: "" // displays an error message if hasErrors is true
    },
    body: {
      value: "", // the text value the user writes
      hasErrors: false, // if there is an error in regards to to the body (if it is empty) it will become true
      message: "" // displays an error message if hasErrors is true
    },
    isFetching: true, // defines the browser is fetching the data from the database
    isSaving: false, // refers to clicking the 'Save Updates' button
    id: useParams().id, // get the id of the url
    sendCount: 0, // keeps track of how many times an axious request was made
    notFound: false // used for in the event a user navigates to a post that does not exist
  };

  // reducer function that handles different action
  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        return;
      case "titleChange":
        draft.title.hasErrors = false;
        draft.title.value = action.value;
        return;
      case "bodyChange":
        draft.body.hasErrors = false;
        draft.body.value = action.value;
        return;
      case "submitRequest":
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++;
        }
        return;
      case "saveRequestStarted":
        draft.isSaving = true;
        return;
      case "saveRequestFinished":
        draft.isSaving = false;
        return;
      case "titleRules":
        if (!action.value.trim()) {
          (draft.title.hasErrors = true), (draft.title.message = "You must provide a title");
        }
        return;
      case "bodyRules":
        if (!action.value.trim()) {
          (draft.body.hasErrors = true), (draft.body.message = "You must provide body content");
        }
        return;
      case "notFound":
        draft.notFound = true;
        return;
    }
  };

  // using the immer reducer to handle the state of the title & body
  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  const sumbitHandler = e => {
    e.preventDefault();
    dispatch({ type: "titleRules", value: state.title.value });
    dispatch({ type: "bodyRules", value: state.body.value });
    dispatch({ type: "submitRequest" });
  };

  // sends a request to the database for the user' posts
  useEffect(() => {
    // identify the axios request by givining it an cancel token, so that it can be used in the useEffect() clean function in lines 35 - 37
    const ourRequest = Axios.CancelToken.source();

    const fetchPost = async () => {
      try {
        // { cancelToken: ourRequest.token } -- used to identify the axios request
        const response = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token });
        // console.log(response.data); // outputs an object containing the information about a individual post such as title, body, author, date the post was created
        // if database sent back data use 'fetchComplete' in the ourReducer(), else use "notFound" in the ourReducer()
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data });
          // if the user of a account is not the author of the post, out the message 'You do not have permission to edit this post' and redirect them to the home screen
          if (appState.user.username != response.data.author.username) {
            appDispatch({ type: "flashMessage", value: "You do not have permission to edit that post" });
            navigate("/");
          }
        } else {
          dispatch({ type: "notFound" });
        }
      } catch (error) {
        console.log(`There was a problem or the request was cancelled`);
      }
    };
    fetchPost();

    // uses the useEffect() clean up function  when the component is no longer in use.
    return () => {
      ourRequest.cancel();
    };
  }, []);

  // sends a post request to save the updates to the database
  useEffect(() => {
    if (state.sendCount) {
      //
      dispatch({ type: "saveRequestStarted" });
      // identify the axios request by givining it an cancel token, so that it can be used in the useEffect() clean function in lines 35 - 37
      const ourRequest = Axios.CancelToken.source();

      const fetchPost = async () => {
        try {
          // { cancelToken: ourRequest.token } -- used to identify the axios request
          const response = await Axios.post(`/post/${state.id}/edit`, { title: state.title.value, body: state.body.value, token: appState.user.token }, { cancelToken: ourRequest.token });
          // console.log(response.data); // outputs an object containing the information about a individual post such as title, body, author, date the post was created
          dispatch({ type: "saveRequestFinished" });
          appDispatch({ type: "flashMessage", value: "Post was updated" });
        } catch (error) {
          console.log(`There was a problem or the request was cancelled`);
        }
      };
      fetchPost();

      // uses the useEffect() clean up function  when the component is no longer in use.
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.sendCount]);

  // if a page does not exist output the stated JSX
  if (state.notFound) {
    return <NotFound />;
  }

  // if isLoading is true return the 'LoadingDotsIcon' component
  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  return (
    <Page title="Edit Post">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        &laquo; Back to view post
      </Link>
      <form className="mt-3" onSubmit={sumbitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onBlur={e => dispatch({ type: "titleRules", value: e.target.value })} onChange={e => dispatch({ type: "titleChange", value: e.target.value })} value={state.title.value} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          {/* show error message if hasErrors in the title object is true */}
          {state.title.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onBlur={e => dispatch({ type: "bodyRules", value: e.target.value })} onChange={e => dispatch({ type: "bodyChange", value: e.target.value })} value={state.body.value} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" />
          {/* show error message if hasErrors in the body object is true */}
          {state.body.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          {state.isSaving ? "Saving..." : "Save Updates"}
        </button>
      </form>
    </Page>
  );
};

export default EditPost;
