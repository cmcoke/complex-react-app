import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import StateContent from "../StateContext";
import HeaderLoggedIn from "./HeaderLoggedIn";
import HeaderLoggedOut from "./HeaderLoggedOut";

const Header = props => {
  const appState = useContext(StateContent);

  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            ComplexApp
          </Link>
        </h4>
        {/* if 'loggedIn' is true render the 'HeaderLoggedIn' component else render the 'HeaderLoggedOut' component  */}
        {appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
      </div>
    </header>
  );
};

export default Header;
