import React, { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => {
                console.log(this.state);
            }
        );
    }
    onSubmit(e) {
        console.log(this.state);

        e.preventDefault();
        axios.post("/login", this.state).then(resp => {
            if (resp.data.success) {
                location.replace("/");
            } else {
                this.setState({
                    error: true
                });
            }
        });
    }
    render() {
        return (
            <div id="login">
                <h2>Please login</h2>

                <input
                    onChange={this.onChange}
                    name="email"
                    type="email"
                    placeholder="email"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="password"
                    onChange={this.onChange}
                />
                <button onClick={this.onSubmit}>Login</button>

                {this.state.error && (
                    <div className="err">
                        Oops, something went wrong! Please try again.
                    </div>
                )}
                <Link to="/">Register</Link>
            </div>
        );
    }
}
// export default Login;
