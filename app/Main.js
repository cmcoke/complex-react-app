import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// My Components
import About from "./components/About";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import HomeGuest from "./components/HomeGuest";
import Terms from "./components/Terms";

const Main = () => {
  /* Boolean(localStorage.getItem("complexappToken") -- if "complexappToken" exists in local storage set 'loggedIn' to true if not set it to false */
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("complexappToken")));

  return (
    <BrowserRouter>
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Routes>
        {/* if the user is logged in render the "Home" component if not render the "HomeGuest" */}
        <Route path="/" element={loggedIn ? <Home /> : <HomeGuest />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

// update changes to the browser without reloading the browser whenever a change has been made to a JS file.
if (module.hot) {
  module.hot.accept();
}
