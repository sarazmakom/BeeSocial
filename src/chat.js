import React from "react";
import { getSocket } from "./socket";
const socket = getSocket();

class Chat extends React.Component() {
    render() {
        return (
            <div>
                <textarea onChange={() => this}> </textarea>
                <button
                    onClick={e =>
                        socket.emit("chatMessage", this.textarea.value)
                    }
                />
            </div>
        );
    }
}
