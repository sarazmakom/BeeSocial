import React from "react";
import { connect } from "react-redux";
import { BrowserRouter, Link, Route } from "react-router-dom";

class Online extends React.Component {
    constructor(props) {
        super(props);
    }
    onlineUsers() {
        return this.props.onlineUsers.map(user => {
            console.log("user", user);
            return (
                <div className="online" key={user.id}>
                    <Link to={`/users/${user.id}`} className="link-style">
                        <img className="onlineImage" src={user.image_url} />
                        <h3>
                            {user.first} {user.last}
                        </h3>
                    </Link>
                </div>
            );
        });
    }
    render() {
        if (!this.props.onlineUsers) {
            return null;
        }
        return (
            <div className="online">
                <h2>Online users:</h2>

                <div>{this.onlineUsers()}</div>
            </div>
        );
    }
}

const getStateFromRedux = state => {
    console.log("getStateFromRedux", state);
    return {
        onlineUsers: state.onlineUsers
    };
};

export default connect(getStateFromRedux)(Online);
