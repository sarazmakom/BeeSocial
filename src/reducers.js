export default function(state = {}, action) {
    if (action.type == "GET_USER_INFO") {
        console.log("inside get user info", state);
        state = Object.assign({}, state, {
            userData: action.userData
        });
    }

    if (action.type == "RECEIVE_FRIENDS_AND_WANNABES") {
        console.log("inside receive", action);
        state = Object.assign({}, state, {
            friendslist: action.list
        });
    }

    if (action.type == "ACCEPT_FRIENDSHIP") {
        const friendlistCopy = state.friendslist.map(friend => {
            if (friend.id == action.friendUpdated) {
                friend = {
                    ...friend,
                    status: 2
                };
            }
            return friend;
        });
        console.log("hello", friendlistCopy, state.friendslist);
        state = Object.assign({}, state, {
            friendslist: friendlistCopy
        });
    }

    if (action.type == "END_FRIENDSHIP") {
        const friendlistCopy = state.friendslist.map(friend => {
            if (friend.id == action.friendDeleted) {
                friend = {
                    ...friend,
                    status: 0
                };
            }
            return friend;
        });
        state = Object.assign({}, state, {
            friendslist: friendlistCopy
        });
    }

    if (action.type == "ONLINE_USERS") {
        state = Object.assign({}, state, {
            onlineUsers: action.users
        });
    }
    if (action.type == "USER_JOINED") {
        if (state.onlineUsers) {
            state = Object.assign({}, state, {
                onlineUsers: state.onlineUsers.concat(action.user)
            });
        }
    }
    if (action.type == "USER_LEFT") {
        const newUsers = state.onlineUsers.filter(user => {
            return user.id != action.userId;
        });
        state = Object.assign({}, state, {
            onlineUsers: newUsers
        });
    }

    return state;
}
