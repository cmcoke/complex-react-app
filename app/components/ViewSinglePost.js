import React, { useContext, useEffect, useState } from "react";
import Page from "./Page";
import Axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkdown from "react-markdown"; // allows markdown text in React (a list of different markdowns -- https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
import ReactTooltip from "react-tooltip";
import NotFound from "./NotFound";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

const ViewSinglePost = () => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();

  // tracks if the request to the database is finished loading or not
  const [isLoading, setIsLoading] = useState(true);

  // gets to current user profile id
  const { id } = useParams();

  // stores information about a user' individual post such as title, body, author, date the post was created
  const [post, setPost] = useState();

  // sends a request to the database for the user' posts
  useEffect(() => {
    // identify the axios request by givining it an cancel token, so that it can be used in the useEffect() clean function in lines 35 - 37
    const ourRequest = Axios.CancelToken.source();

    const fetchPost = async () => {
      try {
        // { cancelToken: ourRequest.token } -- used to identify the axios request
        const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token });
        // console.log(response.data); // outputs an object containing the information about a individual post such as title, body, author, date the post was created
        setPost(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(`There was a problem or the request was cancelled`);
      }
    };
    fetchPost();

    // uses the useEffect() clean up function  when the component is no longer in use.
    return () => {
      ourRequest.cancel();
    };
  }, [id]);

  // if a page does not exist output the stated JSX
  if (!isLoading && !post) {
    return <NotFound />;
  }

  // if isLoading is true return the 'LoadingDotsIcon' component
  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  // gets the month, date & year in which the post was created
  const date = new Date(post.createdDate);
  // formats the date to output month/date/year
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  // if you are logged in a the owner of the post display the edit & delete icons
  const isOwner = () => {
    if (appState.loggedIn) {
      return appState.user.username == post.author.username;
    }
    return false;
  };

  // deletes a post
  const handleDelete = async () => {
    const areYouSure = window.confirm("Do you really want to delete this post?");
    // if the user click the okay button when asked "Do you really want to delete this post?" then send a delete request to the datanase
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } }); // sends a delete request to the database with the user' token which is used for authentication with database
        // if the database responsed with a  "Success"
        if (response.data == "Success") {
          appDispatch({ type: "flashMessage", value: "the post was deleted successfully" }); // display the message "the post was deleted successfully"
          navigate(`/profile/${appState.user.username}`); // redirect to the home screen
        }
      } catch (error) {
        console.log("there was a problem");
      }
    }
  };

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {/* if the current user created the post display the edit & delete icons */}
        {isOwner() && (
          <span className="pt-2">
            <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
              <i className="fas fa-edit"></i>
            </Link>
            {/* adds a tooltip for the edit icon when a user hover over it. 'data-tip="Edit" & data-for="edit"' in the a tag above are used to associate with '<ReactTooltip id="edit"/>'  */}
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a onClick={handleDelete} data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
              <i className="fas fa-trash"></i>
            </a>
            {/* adds a tooltip for the edit icon when a user hover over it. 'data-tip="Delete" & data-for="delete"' in the a tag above are used to associate with '<ReactTooltip id="delete"/>'  */}
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
      </p>

      <div className="body-content">
        {/* uses the ReactMarkdown component to write markdown text */}
        <ReactMarkdown children={post.body} allowedElements={["p", "br", "strong", "em", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "li"]} />
      </div>
    </Page>
  );
};

export default ViewSinglePost;
