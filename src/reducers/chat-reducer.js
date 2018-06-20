import { 
    UPDATE_SELECTED_USER,
    UPDATE_USERNAME,
    UPDATE_USERS,
    UPDATE_ERROR,
    UPDATE_SOCKET,
    UPDATE_MESSAGES
} from '../actions/chat-actions';

const initialChatState = {
    selectedUser: null,
    myUsername: '',
    users: [],
    error: {
        visible: false,
        message: ''
    },
    socket: null,
    messages: []
};

export const chat = (state = initialChatState, action) => {
    switch(action.type) {
        default:
            return state;
        case UPDATE_SELECTED_USER:
            return {
                ...state,
                selectedUser: action.user
            };
        case UPDATE_USERNAME:
            return {
                ...state,
                myUsername: action.username
            };
        case UPDATE_USERS:
            return {
                ...state,
                users: action.users
            };
        case UPDATE_ERROR:
            return {
                ...state,
                error: action.error
            };
        case UPDATE_SOCKET:
            return {
                ...state,
                socket: action.socket
            }
        case UPDATE_MESSAGES:
            return {
                ...state,
                messages: [...state.messages, action.newMessage]
            };
    }
};
