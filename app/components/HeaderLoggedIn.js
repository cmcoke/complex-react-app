import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import DispatchContent from "../DispatchContext";
import StateContent from "../StateContext";

const HeaderLoggedIn = props => {
  const appDispatch = useContext(DispatchContent);
  const appState = useContext(StateContent);

  const handleLogout = () => {
    appDispatch({ type: "logout" });
  };

  const handleOpenSearch = e => {
    e.preventDefault();
    appDispatch({ type: "openSearch" });
  };

  return (
    <div className="flex-row my-3 my-md-0">
      <a data-for="search" data-tip="Search" onClick={handleOpenSearch} href="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <ReactTooltip place="bottom" id="search" className="custom-tooltip" />
      {/* 
        className={"mr-2 header-chat-icon " + (appState.unreadChatCount ? "text-danger" : "text-white")} -- unreadChatCount is true make the chat icon red else make it white 
      */}
      <span onClick={() => appDispatch({ type: "toggleChat" })} data-for="chat" data-tip="Chat" className={"mr-2 header-chat-icon " + (appState.unreadChatCount ? "text-danger" : "text-white")}>
        <i className="fas fa-comment"></i>
        {/* 
            shows the number of unread messages.

            if there are more than 9 messages, 9+ is used to show that there are more than 9 messages
        */}
        {appState.unreadChatCount ? <span className="chat-count-badge text-white">{appState.unreadChatCount < 10 ? appState.unreadChatCount : "9+"}</span> : ""}
      </span>
      <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />{" "}
      <Link to={`/profile/${appState.user.username}`} className="mr-2" data-for="profile" data-tip="My Profile">
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link>
      <ReactTooltip place="bottom" id="profile" className="custom-tooltip" />{" "}
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>{" "}
      <button onClick={handleLogout} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
};

export default HeaderLoggedIn;
