import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Post from "./Post";

const ProfilePosts = () => {
  // tracks if the request to the database is finished loading or not
  const [isLoading, setIsLoading] = useState(true);

  // gets to current user profile name
  const { username } = useParams();

  // stores the data for all the user' posts
  const [posts, setPosts] = useState([]);

  // sends a request to the database for the user' posts whenever the user name in the url changes
  useEffect(() => {
    // identify the axios request by givining it an cancel token, so that it can be used in the useEffect() clean function in lines 35 - 37
    const ourRequest = Axios.CancelToken.source();

    const fetchPosts = async () => {
      try {
        // { cancelToken: ourRequest.token } -- used to identify the axios request
        const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token });
        // console.log(response.data); // outputs an object containing the different post' that the user created
        setPosts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(`There was a problem`);
      }
    };
    fetchPosts();

    // uses the useEffect() clean up function  when the component is no longer in use.
    return () => {
      ourRequest.cancel();
    };
  }, [username]);

  // if isLoading is true return the 'LoadingDotsIcon' component
  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {posts.map(post => {
        return <Post post={post} key={post._id} noAuthor={true} />;
      })}
    </div>
  );
};

export default ProfilePosts;
