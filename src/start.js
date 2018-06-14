import React from "react";
import ReactDOM from "react-dom";
import Axios from "axios";
import Welcome from "./welcome";
import Logo from "./logo";
import Register from "./register";
import App from "./app";

// import { Provider } from "react-redux";
// import { createStore, applyMiddleware } from "redux";
// import reduxPromise from "redux-promise";
// import reducer from "./reducers";
//
// const store = createStore(reducer, applyMiddleware(reduxPromise));

let component;
if (location.pathname == "/welcome") {
    component = <Welcome />;
} else {
    component = (
        // <Provider store={store}>
        <App />
        // </Provider>
    );
}

ReactDOM.render(component, document.querySelector("main"));
