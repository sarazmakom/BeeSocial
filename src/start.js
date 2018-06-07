import React from "react";
import ReactDOM from "react-dom";
import Axios from "axios";
import Welcome from "./welcome";
import Logo from "./logo";
import Register from "./register";
import App from "./app";

// if (location.pathname == '/welcome') {
//     console.log('logged OUT');
// } else {
//     console.log('logged IN');
// }

let component;
if (location.pathname == "/welcome") {
    component = <Welcome />;
} else {
    component = <App />;
}

ReactDOM.render(component, document.querySelector("main"));
