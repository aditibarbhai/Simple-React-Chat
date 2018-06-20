export const UPDATE_SELECTED_USER = 'UPDATE_SELECTED_USER';
export const UPDATE_USERNAME = 'UPDATE_USERNAME';
export const UPDATE_USERS = 'UPDATE_USERS';
export const UPDATE_ERROR = 'UPDATE_ERROR';
export const UPDATE_SOCKET = 'UPDATE_SOCKET';
export const UPDATE_MESSAGES = 'UPDATE_MESSAGES';

export const updateSocket = (socket) => {
    return {
        type: UPDATE_SOCKET,
        socket
    };
};

export const updateSelectedUser = (user) => {
    return {
        type: UPDATE_SELECTED_USER,
        user
    };
};

export const updateUsername = (username) => {
    return {
        type: UPDATE_USERNAME,
        username
    };
};

export const createUsername = (username) => {
    return dispatch => {
        dispatch(updateError({
            visible: false,
            message: ''
        }));
        dispatch(updateUsername(username));
    }
};

export const updateUsers = (users) => {
    return {
        type: UPDATE_USERS,
        users
    }
}

export const updateError = (error) => {
    return {
        type: UPDATE_ERROR,
        error
    };
}

export const sendMessage = (message) => {
    return (dispatch, getState) => {
        dispatch(updateMessages({
            message,
            from: getState().myUsername,
            to: getState().selectedUser
        }));
    }
};

export const updateMessages = (newMessage) => {
    return {
        type: UPDATE_MESSAGES,
        newMessage
    }
}