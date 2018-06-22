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

export function onlineUsers(users) {
    return {
        type: "ONLINE_USERS",
        users
    };
}

export function userLeft(userId) {
    return {
        type: "USER_LEFT",
        userId
    };
}

export function userJoined(newUser) {
    return {
        type: "USER_JOINED",
        newUser
    };
}

export function chatMessage(message) {
    console.log("this is the 'payload'", message);
    return {
        type: "CHAT_MESSAGE",
        message: message
    };
}

export function chatMessages(messages) {
    console.log("all messages", messages);
    return {
        type: "CHAT_MESSAGES",
        messages: messages
    };
}

// in actions
// if (action.type == "USER_JOINED"){
//     return{
//         ...state,
//         onlineUsers: [ ...state.onlineUsers]
//     }
// }
