import * as io from "socket.io-client";
import {
    onlineUsers,
    userJoined,
    userLeft,
    chatMessage,
    chatMessages
} from "./actions";

let socket;

export function getSocket(store) {
    if (!socket) {
        socket = io.connect();

        socket.on("onlineUsers", users => {
            store.dispatch(onlineUsers(users));
        });

        socket.on("userJoined", user => {
            store.dispatch(userJoined(user));
        });

        socket.on("userLeft", id => {
            store.dispatch(userLeft(id));
        });

        socket.on("chatMessages", messages => {
            store.dispatch(chatMessages(messages));
        });

        socket.on("chatMessage", message => {
            store.dispatch(chatMessage(message));
        });
    }
    return socket;
}

export function emit(event, data) {
    socket.emit(event, data);
}
