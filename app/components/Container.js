import React from "react";

const Container = props => {
  return <div className={`container py-md-5 ${props.wide ? "" : "container--narrow"}`}>{props.children}</div>;
};

export default Container;

/*

  {props.children} -- refers to the content that is nested inside the Container component

  This component adds the 'container' class on pages.

*/
