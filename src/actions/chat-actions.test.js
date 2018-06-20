import * as chatActions from './chat-actions';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Chat actions', () => {
    const initialChatState = {
        selectedUser: null,
        myUsername: '',
        users: ['test', 'one', 'two'],
        error: {
            visible: false,
            message: ''
        },
        socket: null,
        messages: []
    };
    
    it ('updateSocket should return action of type UPDATE_SOCKET', () => {
        const socket = 'testSocket',
            expectedAction = {
                type: chatActions.UPDATE_SOCKET,
                socket
            },
            returnedAction = chatActions.updateSocket(socket);
        
        expect(returnedAction).toMatchObject(expectedAction);
    });
    
    it ('updateSelectedUser should return action of type UPDATE_SELECTED_USER', () => {
        const user = 'testUser',
            expectedAction = {
                type: chatActions.UPDATE_SELECTED_USER,
                user
            },
            returnedAction = chatActions.updateSelectedUser(user);
        
        expect(returnedAction).toMatchObject(expectedAction);
    });

    it ('updateUsername should return action of type UPDATE_USERNAME', () => {
        const username = 'myUsername',
            expectedAction = {
                type: chatActions.UPDATE_USERNAME,
                username
            },
            returnedAction = chatActions.updateUsername(username);
        
        expect(returnedAction).toMatchObject(expectedAction);
    });

    it ('createUsername should dispatch updateError and updateUsername', () => {
        const expectedActions = [
            { 
                type: chatActions.UPDATE_ERROR, 
                error: { visible: false, message: '' } 
            },
            {
                type: chatActions.UPDATE_USERNAME, 
                username: 'myUsername'
            } 
          ], 
          store = mockStore({ initialChatState })
          
        store.dispatch(chatActions.createUsername('myUsername'));
      
        expect(store.getActions()).toEqual(expectedActions);
    });

    it ('updateUsers should return action of type UPDATE_USERS', () => {
        const users = ['myUsername', 'testUser'],
            expectedAction = {
                type: chatActions.UPDATE_USERS,
                users
            },
            returnedAction = chatActions.updateUsers(users);
        
        expect(returnedAction).toMatchObject(expectedAction);
    });

    it ('updateError should return action of type UPDATE_ERROR', () => {
        const error = {
                visible: true,
                message: 'something went wrong!'
            },
            expectedAction = {
                type: chatActions.UPDATE_ERROR,
                error
            },
            returnedAction = chatActions.updateError(error);
        
        expect(returnedAction).toMatchObject(expectedAction);
    });

    it ('updateMessages should return action of type UPDATE_MESSAGES', () => {
        const newMessage = {
                message: 'test message',
                to: 'testUser',
                from: 'myUsername'
            },
            expectedAction = {
                type: chatActions.UPDATE_MESSAGES,
                newMessage
            },
            returnedAction = chatActions.updateMessages(newMessage);
        
        expect(returnedAction).toMatchObject(expectedAction);
    });

    it ('sendMessage should dispatch updateMessages', () => {
        const expectedActions = [
            { 
                type: chatActions.UPDATE_MESSAGES, 
                newMessage: {
                    message: 'test message',
                    to: undefined,
                    from: undefined
                }
            }], 
          store = mockStore({ initialChatState })
          
        store.dispatch(chatActions.sendMessage('test message'));
      
        expect(store.getActions()).toEqual(expectedActions)
    });

});