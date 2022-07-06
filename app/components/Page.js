import React, { useEffect } from "react";
import Container from "./Container";

const Page = props => {
  useEffect(() => {
    document.title = `${props.title} | Complex App`;
    window.scrollTo(0, 0);
  }, []);

  return <Container wide={props.wide}>{props.children}</Container>;
};

export default Page;

/*

  This component is responsible for setting the title of the browser tab bar and ensure that the page is always scrolls to the top on page load. 
  It also return the 'Container' component


  From Lesson 23. - Quick Details & Composition
  Composition -- refers to a specific components (HomeGuest, About, Terms) using a generic component/s (Page) and passing props (title, wide, children) if necessary in order to prevent duplications in ones code.

*/
