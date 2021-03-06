import React, { useState, useReducer, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8080"; // sets axios default url
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group"; // is used to handle css transition for an element.

import StateContext from "./StateContext"; /* import the component that allows for the use of React' context for state  */
import DispatchContext from "./DispatchContext"; /* import the component that allows for the use of React' context for dispatch  */

// My Components
import About from "./components/About";
import CreatePost from "./components/CreatePost";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import HomeGuest from "./components/HomeGuest";
import Terms from "./components/Terms";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
import Search from "./components/Search";
import Chat from "./components/Chat";

const Main = () => {
  /*
  
    Lesson 41. useReducer

    useReducer() 
    
      -- is an alternative to useState()

      -- it is usually preferable to useState when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one.

      -- it returns an array of two values state & dispatch

          -- state: represents the previous or currenst value of the state.

          -- dispatch: is used to call/update state.

      -- it accepts two arguments

          -- 1st: (Ex -- ourReducer)

          -- 2nd: is the initial value of the state (Ex -- initialState)
  
  */

  /* useReducer configs */
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")) /* Boolean(localStorage.getItem("complexappToken") -- if "complexappToken" exists in local storage set 'loggedIn' to true if not set it to false */,
    flashMessages: [],
    /* the user object gets the stated data from localStorage */
    user: {
      token: localStorage.getItem("complexappToken"),
      username: localStorage.getItem("complexappUsername"),
      avatar: localStorage.getItem("complexappAvatar")
    },
    isSearchOpen: false, // ensure that the serch overlay does not show by default
    isChatOpen: false, // ensure that the chat message box does not show by default
    unreadChatCount: 0
  };

  /*
  
    Lesson 43. Immer

    const ourReducer = (state, action)

    instead of using 'const ourReducer = (state, action)' , 'const ourReducer = (draft, action)' is used in order to work with the immer library

  */

  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data; // relates to data from the localStorage
        return;

      case "logout":
        draft.loggedIn = false;
        return;

      case "flashMessage":
        draft.flashMessages.push(action.value);
        return;

      case "openSearch":
        draft.isSearchOpen = true;
        return;

      case "closeSearch":
        draft.isSearchOpen = false;
        return;

      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen; // allows isChatOpen to be true (open the chat ) or false (close the chat) when clicking the chat icon on the header section
        return;

      case "closeChat":
        draft.isChatOpen = false;
        return;

      case "incrementUnreadChatCount":
        draft.unreadChatCount++;
        return;

      case "clearUnreadChatCount":
        draft.unreadChatCount = 0;
        return;
    }
  };

  // const [state, dispatch] = useReducer(ourReducer, initialState);
  const [state, dispatch] = useImmerReducer(ourReducer, initialState); // use the immer library to handle useReducer actions

  // if state.loggedIn is true store login data in localStorage else remove it
  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("complexappAvatar", state.user.avatar);
      localStorage.setItem("complexappToken", state.user.token);
      localStorage.setItem("complexappUsername", state.user.username);
    } else {
      localStorage.removeItem("complexappAvatar");
      localStorage.removeItem("complexappToken");
      localStorage.removeItem("complexappUsername");
    }
  }, [state.loggedIn]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Routes>
            {/* 
              /:username -- is a variable that refers to the user' username 
              /* -- is used for sub-routes (Ex. /following or /followers)
            */}
            <Route path="/profile/:username/*" element={<Profile />} />
            {/* if the user is logged in render the "Home" component if not render the "HomeGuest" */}
            <Route path="/" element={state.loggedIn ? <Home /> : <HomeGuest />} />
            {/* "/:id" -- represents a parameter that is unique to every post that is created */}
            <Route path="/post/:id" element={<ViewSinglePost />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/post/:id/edit" element={<EditPost />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* 
          
              CSSTransition is used to handle css transition for an element.

              timeout -- refers to many milli-seconds the css tranisition takes to complete

              in -- a boolean value

              classNames -- the css classes that should be used on the component

              unmountOnExit -- remove the component from the DOM when 'in' is false
            
          */}
          <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
            <Search />
          </CSSTransition>
          <Chat />
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

// update changes to the browser without reloading the browser whenever a change has been made to a JS file.
if (module.hot) {
  module.hot.accept();
}

/*  

    Lesson 40. Context

    In order to pass the addFlashMessage() and setLoggedIn(), a React feature called 'context' is used.

    -- context: allows for value/s or data to passed from a component (Ex -- ExampleContent ) that creates content to be passed to other child components regardless of how deep the child components are

    -- In order to use React' 'context' feature, 

          -- import the file that allows for the creation of context. Ex -- line 17 
    
          -- the 'ExampleContent.Provider' component wraps the 'BrowserRouter' component. Ex -- line 30 & 45

          -- To pass value/s or data from the 'ExampleContent.Provider' component to the other child components, a prop called 'value' is used. It contains an object with the different value/s or data 
             that should be passed to the other child components -- Ex -- line 30.

*/

/*

  Lesson 42. useReducer & context

  <StateContext.Provider value={state}> -- makes state avaiable to any component

  <DispatchContext.Provider value={dispatch}> -- makes dispatch avaiable to any component


*/
