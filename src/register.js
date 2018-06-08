import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleInput(e) {
        this[e.target.name] = e.target.value;
    }
    handleSubmit() {
        const { first, last, email, password } = this;
        axios
            .post("/register", {
                first,
                last,
                email,
                password
            })
            .then(resp => {
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
            <div id="register">
                <h2>Please register:</h2>

                {this.state.error && (
                    <div className="err">
                        Oops, something went wrong! Please try again.
                    </div>
                )}
                <input
                    type="text"
                    name="first"
                    onChange={this.handleInput}
                    placeholder="first"
                />
                <input
                    type="text"
                    name="last"
                    onChange={this.handleInput}
                    placeholder="last"
                />
                <input
                    type="text"
                    name="email"
                    onChange={this.handleInput}
                    placeholder="email"
                />
                <input
                    type="text"
                    name="password"
                    placeholder="password"
                    onChange={this.handleInput}
                />
                <button onClick={this.handleSubmit}>Register</button>
                <Link to="/login">Login</Link>
            </div>
        );
    }
}
