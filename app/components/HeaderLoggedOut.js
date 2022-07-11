import React, { useState, useContext } from "react";
import Axios from "axios";
import DispatchContent from "../DispatchContext";

const HeaderLoggedOut = props => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const appDispatch = useContext(DispatchContent);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      /*
      using the axios libary to send a post request to the "MangoDB" database

       http://localhost:8080 -- is the url that the request is sent to (starting from lesson 37, Axios default base url is set in the "Main" component. This allows only "/login" to be used.)

       /login -- is the action that should be taken

       { username, password } -- refers to the data that is sent to the server ( username, password -- are the names of the states as created in lines 6 - 8 )
    */
      const response = await Axios.post("/login", { username, password });

      /* outputs an object that is the data (avatar, token & username associated the user account) from the "MangoDB" database  */
      // console.log(response.data);

      if (response.data) {
        /* adds the user' avatar, token & username to the browser' local storage. This ensures that when the user is logged in, they stay logged in incase the browser refreashs or closes */
        localStorage.setItem("complexappAvatar", response.data.avatar);
        localStorage.setItem("complexappToken", response.data.token);
        localStorage.setItem("complexappUsername", response.data.username);

        appDispatch({ type: "login" });
      } else {
        console.log("Incorrect username / password");
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          {/* onChange={e => setUsername(e.target.value)} -- gets the input value and stores it into state */}
          <input onChange={e => setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          {/* onChange={e => setPassword(e.target.value)} -- gets the input value and stores it into state */}
          <input onChange={e => setPassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
};

export default HeaderLoggedOut;
