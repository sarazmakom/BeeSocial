// import * as io from "socket.io-client";
// import { onlineUsers, userJoined, userLeft } from "./actions";
//
// io.connect();
//
// let socket;
//
// export function getSocket(store) {
//     if (!socket) {
//         socket = io.connect();
//
//         socket.on("onlineUsers", users => {
//             store.dispatch(onlineUsers(users));
//         });
//         socket.on("userJoined", user => {
//             store.dispatch(userJoined(user));
//             //reducer action user attached to it clones onlineUsers array and adds to it a new user
//         });
//         socket.on("userLeft", id => {
//             store.dispatch(userLeft(id));
//         });
//     }
//     return socket;
// }
//
// export function emit(eventName, data) {}

//object or array
// {socket.id : req.session.userId}
//Object.keys(online)
//Object.values(online)
//const ids+ Object.values(online)
//ids.indexOf(10) > -1 //true   - to see whether certain person is online or not
//ids.indexOf(11) > -1 //false - not online
