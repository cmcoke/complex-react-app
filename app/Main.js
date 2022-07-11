import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8080"; // sets axios default url

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
import ExampleContent from "./ExampleContext"; /* import the component that allows for the use of React' context  */

const Main = () => {
  /* Boolean(localStorage.getItem("complexappToken") -- if "complexappToken" exists in local storage set 'loggedIn' to true if not set it to false */
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("complexappToken")));

  const [flashMessages, setFlashMessages] = useState([]);

  const addFlashMessage = msg => {
    setFlashMessages(prev => prev.concat(msg));
  };

  return (
    <ExampleContent.Provider value={{ addFlashMessage, setLoggedIn }}>
      <BrowserRouter>
        <FlashMessages messages={flashMessages} />
        <Header loggedIn={loggedIn} />
        <Routes>
          {/* if the user is logged in render the "Home" component if not render the "HomeGuest" */}
          <Route path="/" element={loggedIn ? <Home /> : <HomeGuest />} />
          {/* "/:id" -- represents a parameter that is unique to every post that is created */}
          <Route path="/post/:id" element={<ViewSinglePost />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ExampleContent.Provider>
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
