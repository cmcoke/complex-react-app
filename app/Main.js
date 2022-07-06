import React from "react";
import ReactDOM from "react-dom/client";

// My Components
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";

const Main = () => {
  return (
    <>
      <Header />
      <HomeGuest />
      <Footer />
    </>
  );
};

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

// update changes to the browser without reloading the browser whenever a change has been made to a JS file.
if (module.hot) {
  module.hot.accept();
}
