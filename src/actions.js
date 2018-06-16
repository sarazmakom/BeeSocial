import axios from "./axios";

export function getUserInfo() {
    return axios.get("/user").then(({ data }) => {
        return {
            type: "GET_USER_INFO",
            userData: data
        };
    });
}

export function receiveFriendsAndWannabes() {
    console.log("receiveFriendsAndWannabes");
    return axios.get("/getfriendslist").then(resp => {
        console.log("resp data from actions: ", resp.data);

        return {
            type: "RECEIVE_FRIENDS_AND_WANNABES",
            list: resp.data
        };
    });
}

export function acceptFriendship(senderId, recipientId) {
    console.log("acceptFriendship");
    return axios
        .post("/acceptRequest", {
            recipient: recipientId,
            sender: senderId
        })
        .then(resp => {
            return {
                type: "ACCEPT_FRIENDSHIP",
                friendUpdated: senderId
            };
        });
}

export function endFriendship(senderId, recipientId) {
    console.log("endFriendship", recipientId, senderId);
    return axios
        .post("/deleteRequest", {
            recipient: recipientId,
            sender: senderId
        })
        .then(resp => {
            return {
                type: "END_FRIENDSHIP",
                friendDeleted: senderId
            };
        });
}
//
// export function onlineUsers(user) {
//     return {
//         type: "ONLINE_USERS",
//         user
//     };
// }
//
// export function userLeft(user) {
//     return {
//         type: "USER_LEFT",
//         user
//     };
// }
//
// export function userJoined(user) {
//     return {
//         type: "USER_JOINED",
//         user
//     };
// }

// in actions
// if (action.type == "USER_JOINED"){
//     return{
//         ...state,
//         onlineUsers: [ ...state.onlineUsers]
//     }
// }
