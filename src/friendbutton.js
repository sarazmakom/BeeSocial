import React from "react";
import axios from "./axios";

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.requestFriendship = this.requestFriendship.bind(this);
        this.getButtonText = this.getButtonText.bind(this);
        this.acceptCancel = this.acceptCancel.bind(this);
        this.deleteRequest = this.deleteRequest.bind(this);
    }
    getButtonText() {
        const { status, recipient } = this.state;
        if (status == 1) {
            console.log(recipient, this.props.otherUserId);
            if (recipient == this.props.otherUserId) {
                this.setState({
                    buttonText: "Cancel request",
                    buttonAction: this.acceptCancel
                });
            } else {
                this.setState({
                    buttonText: "Accept request",
                    buttonAction: this.acceptCancel
                });
            }
        } else if (status == 2) {
            this.setState({
                buttonText: "End friendship",
                buttonAction: this.deleteRequest
            });
        } else {
            this.setState({
                buttonText: "Send friend request",
                buttonAction: this.requestFriendship
            });
        }
    }
    requestFriendship() {
        // console.log("hello there");
        if (!this.state.status) {
            axios
                .post("/requestFriendship", {
                    recipient: this.props.otherUserId
                })
                .then(({ data }) => {
                    this.setState(
                        {
                            status: data.status,
                            recipient: data.recipient_id,
                            sender: data.sender_id
                        },
                        () => this.getButtonText()
                    );
                });
        }
    }
    acceptCancel() {
        if (this.state.status == 1) {
            if (this.state.recipient == this.props.otherUserId) {
                axios
                    .post("/deleteRequest", {
                        recipient: this.state.recipient,
                        sender: this.state.sender
                    })
                    .then(({ data }) => {
                        this.setState(
                            {
                                status: data.status
                            },
                            () => this.getButtonText()
                        );
                    });
            } else {
                console.log("running");
                axios
                    .post("/acceptRequest", {
                        recipient: this.state.recipient,
                        sender: this.state.sender
                    })
                    .then(({ data }) => {
                        console.log("the data", data);
                        this.setState(
                            {
                                status: 2
                            },
                            () => this.getButtonText()
                        );
                    });
            }
        }
    }
    deleteRequest() {
        if (this.state.status == 2) {
            axios
                .post("/deleteRequest", {
                    recipient: this.state.recipient,
                    sender: this.state.sender
                })
                .then(({ data }) => {
                    this.setState(
                        {
                            status: data.status
                        },
                        () => this.getButtonText()
                    );
                });
        }
    }
    componentDidMount() {
        const id = this.props.otherUserId;
        axios.get(`/friendstatus/${id}`).then(({ data }) => {
            this.setState(
                {
                    status: data.status,
                    recipient: data.recipient_id,
                    sender: data.sender_id
                },
                () => this.getButtonText()
            );
        });
    }
    render() {
        return (
            <div>
                <button onClick={this.state.buttonAction}>
                    {this.state.buttonText}
                </button>
            </div>
        );
    }
}
