import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DispatchContent from "../DispatchContext";

const HeaderLoggedIn = props => {
  const appDispatch = useContext(DispatchContent);

  const handleLogout = () => {
    appDispatch({ type: "logout" });

    /* when the user is logged out remove their avatar, token and username that is stored in the browser' local storage. This ensures that they remain logged out. */
    localStorage.removeItem("complexappAvatar");
    localStorage.removeItem("complexappToken");
    localStorage.removeItem("complexappUsername");
  };

  return (
    <div className="flex-row my-3 my-md-0">
      <a href="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <span className="mr-2 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <a href="#" className="mr-2">
        <img className="small-header-avatar" src={localStorage.getItem("complexappAvatar")} />
      </a>
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      <button onClick={handleLogout} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
};

export default HeaderLoggedIn;
