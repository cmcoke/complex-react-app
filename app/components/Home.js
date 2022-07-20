import React, { useContext, useEffect } from "react";
import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";
import StateContent from "../StateContext";
import Axios from "axios";
import { useImmer } from "use-immer";
import { Link } from "react-router-dom";
import Post from "./Post";

const Home = () => {
  const appState = useContext(StateContent);

  const [state, setState] = useImmer({
    isLoading: true,
    feed: [] // where posts are stored after the request as been sent to the database
  });

  // sends a request to the database for home feed posts
  useEffect(() => {
    // identify the axios request by givining it an cancel token, so that it can be used in the useEffect() clean function in lines 35 - 37
    const ourRequest = Axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const response = await Axios.post("/getHomeFeed", { token: appState.user.token }, { cancelToken: ourRequest.token });
        // console.log(response.data); // outputs an object that contains the current user's -- profile name, profile avatar, is following and another object called counts that contain post count, followers count & following count
        setState(draft => {
          draft.isLoading = false;
          draft.feed = response.data;
        });
      } catch (error) {
        console.log(`There was a problem`);
      }
    };
    fetchData();

    // uses the useEffect() clean up function  when the component is no longer in use.
    return () => {
      ourRequest.cancel();
    };
  }, []);

  // shows the loading icon when isloading is true
  if (state.isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <Page title="Your Feed">
      {/* if user' feed is not empty show post from users that they are following */}
      {state.feed.length > 0 && (
        <>
          <h2 className="text-center mb-4">The Latest From Those You Follow</h2>
          <div className="list-group">
            {state.feed.map(post => {
              return <Post post={post} key={post._id} />;
            })}
          </div>
        </>
      )}
      {/* if user' feed is empty show the paragraph that states 'Your feed displays the latest posts from the people you follow .... ' */}
      {state.feed.length == 0 && (
        <>
          <h2 className="text-center">
            Hello <strong>{appState.user.username}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.</p>
        </>
      )}
    </Page>
  );
};

export default Home;
