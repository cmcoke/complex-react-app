import React, { useEffect, useContext } from "react";
import Page from "./Page";
import { useParams, NavLink, Routes, Route } from "react-router-dom";
import Axios from "axios";
import StateContext from "../StateContext";
import ProfilePosts from "./ProfilePosts";
import { useImmer } from "use-immer";
import ProfileFollowers from "./ProfileFollowers";
import ProfileFollowing from "./ProfileFollowing";

const Profile = () => {
  // gets to current user profile name
  const { username } = useParams();

  // allows for the token associated with the current user profile be used when sending a request to the MangoDB database for the current user' data
  const appState = useContext(StateContext);

  // set placeholders as the initial state before a response from the MangoDB database
  const [state, setState] = useImmer({
    followActionLoading: false, // refers to if the follow request is completed or not on the database server
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      isFollowing: false,
      counts: { postCount: "", followerCount: "", followingCount: "" }
    }
  });

  // sends a request to the MangoDB database for the current user' data whenever the user name in the url changes
  useEffect(() => {
    // identify the axios request by givining it an cancel token, so that it can be used in the useEffect() clean function in lines 35 - 37
    const ourRequest = Axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const response = await Axios.post(`/profile/${username}`, { token: appState.user.token }, { cancelToken: ourRequest.token });
        // console.log(response.data); // outputs an object that contains the current user's -- profile name, profile avatar, is following and another object called counts that contain post count, followers count & following count
        setState(draft => {
          draft.profileData = response.data;
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
  }, [username]);

  // increase the startFollowingRequestCount by 1
  const startFollowing = () => {
    setState(draft => {
      draft.startFollowingRequestCount++;
    });
  };

  // whenever draft.startFollowingRequestCount changes this useEffect() runs which sends a request to server regarding following a user
  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true;
      });

      const ourRequest = Axios.CancelToken.source();

      const fetchData = async () => {
        try {
          const response = await Axios.post(`/addFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest.token });
          // console.log(response.data); // outputs an object that contains the current user's -- profile name, profile avatar, is following and another object called counts that contain post count, followers count & following count
          setState(draft => {
            draft.profileData.isFollowing = true; // set isFollowing to true
            draft.profileData.counts.followerCount++; // increatment the 'followers' count by 1
            setState(draft => {
              draft.followActionLoading = false;
            });
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
    }
  }, [state.startFollowingRequestCount]);

  // the function for stop following user
  const stopFollowing = () => {
    setState(draft => {
      draft.stopFollowingRequestCount++;
    });
  };

  // whenever draft.stopFollowingRequestCount changes this useEffect() runs which sends a request to server regarding stop following a user
  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true;
      });

      const ourRequest = Axios.CancelToken.source();

      const fetchData = async () => {
        try {
          const response = await Axios.post(`/removeFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest.token });
          // console.log(response.data); // outputs an object that contains the current user's -- profile name, profile avatar, is following and another object called counts that contain post count, followers count & following count
          setState(draft => {
            draft.profileData.isFollowing = false; // set isFollowing to false
            draft.profileData.counts.followerCount--; // decrease the 'followers' count by 1
            setState(draft => {
              draft.followActionLoading = false;
            });
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
    }
  }, [state.stopFollowingRequestCount]);

  return (
    <Page title="Profile Screen">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
        {/* 

          The following logic determines when the 'follow' button should appear

          appState.loggedIn -- if the user is logged in

          !state.profileData.isFollowing -- if the user that is logged in is not already following the other user that they want to follow

          appState.user.username != state.profileData.profileUsername -- ensure that a user cannot follow their own profile

          state.profileData.profileUsername != "..." -- when the profile first loads prevent the follow button from appearing. After the load the 'follow' button will apppear
        
        */}
        {appState.loggedIn && !state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
          <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">
            Follow <i className="fas fa-user-plus"></i>
          </button>
        )}
        {/* show the stop following button */}
        {appState.loggedIn && state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
          <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2">
            Stop Following <i className="fas fa-user-times"></i>
          </button>
        )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        {/* use the 'react-router-dom' 'NavLink' to switch between the stated tabs */}
        <NavLink to="" end className="nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink to="followers" className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink to="following" className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>

      {/* displays the respected content whenever the following tabs are clicked 'posts', 'followers', 'following'  */}
      <Routes>
        <Route path="" element={<ProfilePosts />} />
        <Route path="followers" element={<ProfileFollowers />} />
        <Route path="following" element={<ProfileFollowing />} />
      </Routes>
    </Page>
  );
};

export default Profile;
