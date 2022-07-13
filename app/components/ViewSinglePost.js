import React, { useEffect, useState } from "react";
import Page from "./Page";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkdown from "react-markdown"; // allows markdown text in React (a list of different markdowns -- https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

const ViewSinglePost = () => {
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
  }, []);

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

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <a href="#" className="text-primary mr-2" title="Edit">
            <i className="fas fa-edit"></i>
          </a>
          <a className="delete-post-button text-danger" title="Delete">
            <i className="fas fa-trash"></i>
          </a>
        </span>
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
