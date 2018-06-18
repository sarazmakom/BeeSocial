import React from "react";
import { connect } from "react-redux";
import {
    receiveFriendsAndWannabes,
    acceptFriendship,
    endFriendship,
    getUserInfo
} from "./actions";

class Friends extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.dispatch(receiveFriendsAndWannabes());
        this.props.dispatch(getUserInfo());
    }
    render() {
        console.log("from friends", this.props.pending);
        return (
            <div>
                <div className="pendingList">
                    <h2>Pending friends:</h2>
                    {this.props.pending &&
                        this.props.pending.map(pending => {
                            return (
                                <div className="pendingImg" key={pending.id}>
                                    <img
                                        src={pending.image_url || "user.png"}
                                    />
                                    <div>
                                        {pending.first}
                                        {pending.last}
                                    </div>

                                    <button
                                        onClick={() =>
                                            this.props.dispatch(
                                                acceptFriendship(
                                                    pending.id,
                                                    this.props.userData.id
                                                )
                                            )
                                        }
                                    >
                                        Accept Request
                                    </button>
                                </div>
                            );
                        })}
                </div>
                <div className="friendsList">
                    <h2>Friends:</h2>

                    {this.props.friends &&
                        this.props.friends.map(friend => {
                            return (
                                <div key={friend.id}>
                                    <img
                                        className="friendImg"
                                        src={friend.image_url || "user.png"}
                                    />
                                    <div>
                                        {friend.first} {friend.last}
                                    </div>
                                    <button
                                        onClick={() =>
                                            this.props.dispatch(
                                                endFriendship(
                                                    friend.id,
                                                    this.props.userData.id
                                                )
                                            )
                                        }
                                    >
                                        End Friendship
                                    </button>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    }
}
const getStateFromRedux = state => {
    console.log("getStateFromRedux", state);
    return {
        pending:
            state.friendslist &&
            state.friendslist.filter(friend => friend.status == 1),
        friends:
            state.friendslist &&
            state.friendslist.filter(friend => friend.status == 2),
        userData: state.userData
    };
};
// export default connect(null)(Friends);
export default connect(getStateFromRedux)(Friends);
