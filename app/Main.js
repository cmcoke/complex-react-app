import React from "react";
import ReactDOM from "react-dom/client";

const ExampleComponent = () => {
  return (
    <div>
      <h1>This is our app!</h1>
      <p>The sky is blue.</p>
    </div>
  );
};

export default ExampleComponent;

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<ExampleComponent />);

// update changes to the browser without reloading the browser whenever a change has been made to a JS file.
if (module.hot) {
  module.hot.accept();
}
