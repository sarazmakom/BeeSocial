import React from "react";
import ReactDOM from "react-dom";
import axios from "./axios";

import Welcome from "./welcome";
import App from "./app";

// import * as io from "socket.io-client";
// import { getSocket } from "./socket";

import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import reducer from "./reducers";

// const socket = io.connect();

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let component;

if (location.pathname == "/welcome") {
    component = <Welcome />;
} else {
    component = (
        <Provider store={store}>
            <App />
        </Provider>
    );
    // getSocket(store);
}

ReactDOM.render(component, document.querySelector("main"));
