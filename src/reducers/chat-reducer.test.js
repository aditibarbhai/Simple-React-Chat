import { chat } from './chat-reducer';
import * as chatActions from '../actions/chat-actions';

describe('Chat reducer', () => {
    
    it ('should return unchanged state by default', () => {
        const returnedState = chat({}, { type: 'TEST' });
        expect(returnedState).toMatchObject({});
    });

    it ('should handle UPDATE_SELECTED_USER action', () => {
        const action = {
                type: chatActions.UPDATE_SELECTED_USER,
                user: 'testUser'
            },
            expectedState = {
                selectedUser: 'testUser'
            },
            returnedState = chat({}, action);

        expect(returnedState).toMatchObject(expectedState);
    });

    it ('should handle UPDATE_USERNAME action', () => {
        const action = {
                type: chatActions.UPDATE_USERNAME,
                username: 'myUsername'
            },
            expectedState = {
                myUsername: 'myUsername'
            },
            returnedState = chat({}, action);

        expect(returnedState).toMatchObject(expectedState);
    });

    it ('should handle UPDATE_USERS action', () => {
        const action = {
                type: chatActions.UPDATE_USERS,
                users: ['testUser']
            },
            expectedState = {
                users: ['testUser']
            },
            returnedState = chat({}, action);

        expect(returnedState).toMatchObject(expectedState);
    });

    it ('should handle UPDATE_ERROR action', () => {
        const action = {
                type: chatActions.UPDATE_ERROR,
                error: {
                    visible: false,
                    message: ''
                }
            },
            expectedState = {
                error: {
                    visible: false,
                    message: ''
                }
            },
            returnedState = chat({}, action);

        expect(returnedState).toMatchObject(expectedState);
    });

    it ('should handle UPDATE_SOCKET action', () => {
        const action = {
                type: chatActions.UPDATE_SOCKET,
                socket: {}
            },
            expectedState = {
                socket: {}
            },
            returnedState = chat({}, action);

        expect(returnedState).toMatchObject(expectedState);
    });

    it ('should handle UPDATE_MESSAGES action', () => {
        const action = {
                type: chatActions.UPDATE_MESSAGES,
                newMessage: {
                    message: 'test message',
                    to: 'testUser',
                    from: 'myUsername'
                }
            },
            expectedState = {
                messages: [{
                    message: 'test message',
                    to: 'testUser',
                    from: 'myUsername'
                }]
            },
            returnedState = chat({ messages: [] }, action);

        expect(returnedState).toMatchObject(expectedState);
    });
});