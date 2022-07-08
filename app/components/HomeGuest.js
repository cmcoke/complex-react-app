import React, { useState } from "react";
import Page from "./Page";
import Axios from "axios";

const HomeGuest = () => {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  // sends the username, email & password values to the "MangoDB" database
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      /*
      using the axios libary to send a post request to the "MangoDB" database

       http://localhost:8080 -- is the url that the request is sent to. (starting from lesson 37, Axios default base url is set in the "Main" component. This allows only "/register" to be used.)

       /register -- is the action that should be taken

       { username, email, password } -- refers to the data that is sent to the server ( username, email, password -- are the names of the states as created in lines 6 - 8 )
    */
      await Axios.post("/register", { username, email, password });
      console.log("User was successfully created");
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <Page wide={true} title={"Welcome !!!"}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Remember Writing?</h1>
          <p className="lead text-muted">Are you sick of short tweets and impersonal &ldquo;shared&rdquo; posts that are reminiscent of the late 90&rsquo;s email forwards? We believe getting back to actually writing is the key to enjoying the internet again.</p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              {/* onChange={e => setUsername(e.target.value)} -- gets the input value and stores it into state */}
              <input onChange={e => setUsername(e.target.value)} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              {/* onChange={e => setEmail(e.target.value)} -- gets the input value and stores it into state */}
              <input onChange={e => setEmail(e.target.value)} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              {/* onChange={e => setPassword(e.target.value)} -- gets the input value and stores it into state */}
              <input onChange={e => setPassword(e.target.value)} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
            </div>
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
              Sign up for ComplexApp
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
};

export default HomeGuest;
