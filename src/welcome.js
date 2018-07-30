import React from "react";
import Register from "./register";
import Login from "./login";
import { HashRouter, Route, Link } from "react-router-dom";
import Logo from "./logo";

export default Welcome;

function Welcome() {
    return (
        <div id="welcome">
            <Logo />
            <h1>social</h1>
            <div>
                <h2>
                    Bee nice, <br />
                    contact your friends.
                </h2>
                <HashRouter>
                    <div>
                        <Route exact path="/" component={Register} />
                        <Route path="/login" component={Login} />
                    </div>
                </HashRouter>
            </div>
        </div>
    );
}
////class example:////
// class Welcome extends React.Component {
//     render() {
//         return (
//             <div id="welcome">
//                 <h1>Welcome to this great social network</h1>
//                 // <img src="/logo.png" />
//                 // <Register />
//                 <HashRouter>
//                     <div>
//                         <Link to="/">Register</Link>
//                         <Link to="/login">Login</Link>
//                         <Route exact path="/" component={Register} />
//                         <Route path="/login" component={Login} />
//                     </div>
//                 </HashRouter>
//             </div>
//         );
//     }
// }
