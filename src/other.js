import React from "react";
import axios from "axios";
import { BrowserRouter, Link, Route } from "react-router-dom";
import FriendButton from "./friendbutton";

export default class OtherPersonProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        // console.log("this.props", this.props);
        const id = this.props.match.params.id;
        // console.log("id", id);
        axios.get(`/users/${id}/info`).then(({ data }) => {
            // console.log("componentDidMount data", data);
            if (data.redirectToProfile) {
                return this.props.history.push("/");
            }
            this.setState(
                {
                    id: data.userId,
                    first: data.first,
                    last: data.last,
                    profilePic: data.profilePic,
                    bio: data.bio
                },
                () => console.log(this.state)
            );
        });
    }
    render() {
        if (!this.state.id) {
            return null;
        }
        return (
            <div id="opp">
                <h1>
                    {this.state.first} {this.state.last}
                </h1>
                <img src={this.state.profilePic} />
                <h2>{this.state.bio}</h2>
                <FriendButton otherUserId={this.props.match.params.id} />
            </div>
        );
    }
}
