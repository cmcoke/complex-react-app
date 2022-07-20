import React, { useContext, useEffect } from "react";
import DispatchContent from "../DispatchContext";
import { useImmer } from "use-immer";
import Axios from "axios";
import { Link } from "react-router-dom";
import Post from "./Post";

const Search = () => {
  const appDispatch = useContext(DispatchContent);

  const [state, setState] = useImmer({
    searchTerm: "", // stores what the types in the search input field
    results: [], // posts that matches the search term are placed in this array
    show: "neither", // refers to what is being displayed in the JSX area of the search overlay. The default is 'neither' (when nothing has been typed in), the other options are 'loadingIcon' (when the data is being fetched) or 'results' (shows the results of the search term)
    requestCount: 0
  });

  // close the search overlay when the 'esc' key is pressed
  useEffect(() => {
    document.addEventListener("keyup", closeOverlay);
    return () => document.removeEventListener("keyup", closeOverlay); // using the useEffect() clean up function to remove the component when it is no longer in use
  }, []);

  const closeOverlay = e => {
    if (e.keyCode == 27) {
      appDispatch({ type: "closeSearch" });
    }
  };

  // stores the types value of the search input field
  const handleInput = e => {
    const value = e.target.value;
    setState(draft => {
      draft.searchTerm = value;
    });
  };

  // defines how long it takes for a request to be sent to the database once the user stops typing
  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState(draft => {
        draft.show = "loading";
      });
      const delay = setTimeout(() => {
        setState(draft => {
          draft.requestCount++;
        });
      }, 750);

      return () => clearTimeout(delay);
    } else {
      setState(draft => {
        draft.show = "neither";
      });
    }
  }, [state.searchTerm]);

  // send axios request for search term
  useEffect(() => {
    if (state.requestCount) {
      // cancels the axios request when the component unmounts in the middle of the request
      const ourRequest = Axios.CancelToken.source();

      const fetchSearchResults = async () => {
        try {
          const response = await Axios.post("/search", { searchTerm: state.searchTerm }, { cancelToken: ourRequest.token });
          setState(draft => {
            draft.results = response.data;
            draft.show = "results";
          });
        } catch (error) {
          console.log("There was a problem or the request was cancelled.");
        }
      };
      fetchSearchResults();

      // uses the useEffect() clean function for the axios request
      return () => ourRequest.cancel();
    }
  }, [state.requestCount]);

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input onChange={handleInput} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
          <span onClick={() => appDispatch({ type: "closeSearch" })} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          {/* shows the loading animation if state.show is loading */}
          <div className={"circle-loader " + (state.show == "loading" ? "circle-loader--visible" : "")}></div>
          {/* shows the results of the search if state.show is results */}
          <div className={"live-search-results " + (state.show == "results" ? "live-search-results--visible" : "")}>
            {/* if there is more than zero search results show display them on the screen */}
            {Boolean(state.results.length) && (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({state.results.length} {state.results.length > 1 ? "items" : "item"} found)
                </div>
                {/* output the search results */}
                {state.results.map(post => {
                  return <Post post={post} key={post._id} onClick={() => appDispatch({ type: "closeSearch" })} />;
                })}
              </div>
            )}
            {/* if there are no matching search results display the message "Sorry, we could not find any results for that search." */}
            {!Boolean(state.results.length) && <p className="alert alert-danger text-center shadow-sm ">Sorry, we could not find any results for that search.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
