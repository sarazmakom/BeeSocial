import React from "react";
import { getSocket } from "./socket";
import { connect } from "react-redux";

class Chat extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidUpdate() {
        this.elem.scrollTop = this.elem.scrollHeight - this.elem.scrollWidth;
    }
    render() {
        return (
            <div id="display">
                <div>
                    <h2>Join our community chat and bee social</h2>
                </div>
                <div
                    ref={elem => {
                        this.elem = elem;
                    }}
                >
                    {this.props.messages &&
                        this.props.messages.map(chats => {
                            return (
                                <div className="chats" key={chats.id}>
                                    <div className="chat-img-left">
                                        <img
                                            className="chatsImage"
                                            src={chats.image_url || "/user.png"}
                                        />
                                    </div>

                                    <div className="display">
                                        <div className="chatty">
                                            {chats.message}
                                        </div>
                                        <div className="time">
                                            <p>
                                                {chats.first} {chats.last} at{" "}
                                                {new Date(
                                                    chats.created_at
                                                ).toLocaleTimeString()}{" "}
                                                on{" "}
                                                {new Date(
                                                    chats.created_at
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>

                <div className="write-message">
                    <textarea
                        id="chat"
                        name="textarea"
                        onChange={e => (this[e.target.name] = e.target.value)}
                    />
                    <button
                        onClick={() =>
                            getSocket().emit("chatMessage", this.textarea)
                        }
                    >
                        Send
                    </button>
                </div>
            </div>
        );
    }
}

const getStateFromRedux = state => {
    console.log("state from chat component", state);
    return {
        messages: state.messages
    };
};

export default connect(getStateFromRedux)(Chat);
