import React, { useContext, useRef, useEffect } from "react";
import DispatchContent from "../DispatchContext";
import StateContent from "../StateContext";
import { useImmer } from "use-immer";
import { io } from "socket.io-client";
const socket = io("http://localhost:8080"); // establish a connection between the browser and backend server
import { Link } from "react-router-dom";

const Chat = () => {
  const chatFeild = useRef(null); // useRef() -- allows values to be mutated
  const chatLog = useRef(null);
  const appDispatch = useContext(DispatchContent);
  const appState = useContext(StateContent);
  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: [] // stores the user' message, username & avatar
  });

  useEffect(() => {
    if (appState.isChatOpen) {
      chatFeild.current.focus(); // when chat is open make the input field become focused (allows the user to immediately write into the input field once the chat is open )
      appDispatch({ type: "clearUnreadChatCount" }); // clears the number of unread message
    }
  }, [appState.isChatOpen]);

  // stores the user' input value
  const handleFieldChange = e => {
    const value = e.target.value;
    setState(draft => {
      draft.fieldValue = value;
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    /* 
        send message to the chat server 

        chatFromBrowser - the name of an event that is emitted to the backend server

        message: state.fieldValue -- what the user types in the input field

        token: appState.user.token -- establish trust with the backend server
    */
    socket.emit("chatFromBrowser", { message: state.fieldValue, token: appState.user.token });

    setState(draft => {
      // adds the user' input value, username & avatar to the chatMessages array state
      draft.chatMessages.push({
        message: draft.fieldValue,
        username: appState.user.username,
        avatar: appState.user.avatar
      });

      draft.fieldValue = ""; // clear the input field after press the enter key
    });
  };

  /* 

    listening for the chat server

    chatFromServer - the name of an event that is emitted from the backend server

  */
  useEffect(() => {
    socket.on("chatFromServer", message => {
      setState(draft => {
        draft.chatMessages.push(message);
      });
    });
  }, []);

  useEffect(() => {
    // ensures that the most recent message is shown at the bottom whenever the scrollbar appears on the chat box.
    chatLog.current.scrollTop = chatLog.current.scrollHeight;

    // increments the number of unread chat messages
    if (state.chatMessages.length && !appState.isChatOpen) {
      appDispatch({ type: "incrementUnreadChatCount" });
    }
  }, [state.chatMessages]);

  return (
    // (appState.isChatOpen ? "chat-wrapper--is-visible" : "") -- if isChatOpen is true add the class chat-wrapper--is-visible (which shows the chat box) if not remove the class chat-wrapper--is-visible
    <div id="chat-wrapper" className={"chat-wrapper shadow border-top border-left border-right " + (appState.isChatOpen ? "chat-wrapper--is-visible" : "")}>
      <div className="chat-title-bar bg-primary">
        Chat
        <span onClick={() => appDispatch({ type: "closeChat" })} className="chat-title-bar-close">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {/* shows the current user chat message & avatar */}
        {state.chatMessages.map((message, index) => {
          if (message.username == appState.user.username) {
            return (
              <div key={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            );
          }
          {
            /* shows the other chat user that the current user is interacting with */
          }
          return (
            <div key={index} className="chat-other">
              <Link to={`/profile/${message.username}`}>
                <img className="avatar-tiny" src={message.avatar} />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profile/${message.username}`}>
                    <strong>{message.username}: </strong>
                  </Link>
                  {message.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit} id="chatForm" className="chat-form border-top">
        {/* ref={chatFeild} -- allows the input field to targeted with the useRef() hook */}
        <input value={state.fieldValue} onChange={handleFieldChange} ref={chatFeild} type="text" className="chat-field" id="chatField" placeholder="Type a message…" autoComplete="off" />
      </form>
    </div>
  );
};

export default Chat;
