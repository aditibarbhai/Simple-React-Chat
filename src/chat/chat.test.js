import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import { Chat } from './chat';
import constants from '../constants';

jest.mock('../conversation/conversation', () => 'Conversation');

describe('Chat', () => {
    let props = {}, wrapper;

    beforeEach(() => {
        props = {
            selectedUser: 'testUser',
            myUsername: 'myTestUsername',
            users: ['testUser', 'myTestUsername'],
            error: {
                visible: false,
                message: ''
            },
            socket: {
                emit: jest.fn(),
                on: jest.fn()
            },
            updateSelectedUser: jest.fn(),
            updateSocket: jest.fn(),
            updateError: jest.fn(),
            createUsername: jest.fn(),
            updateUsers: jest.fn(),
            updateMessages: jest.fn()
        };

        wrapper = shallow(<Chat {...props} />);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it ('should render without errors', () => {
        const tree = renderer
            .create(<Chat {...props} />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

    it ('should render create user form if no username', () => {
        props.myUsername = '';
        props.error.visible = true;
        const tree = renderer
            .create(<Chat {...props} />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

    it ('selectUser should update selected user', () => {
        wrapper.instance().selectUser({ target: { textContent: 'testUser1' } });

        expect(props.updateSelectedUser).toHaveBeenCalledWith('testUser1');
    });

    it ('handleUsernameChange updates state.username', () => {
        expect(wrapper.state().username).toBe('');

        wrapper.instance().handleUsernameChange({ target: { value: 'testUsername' } });

        expect(wrapper.state().username).toBe('testUsername');
    });

    it ('handleCreateUsernameClick should emit CREATE_USER action', () => {
        wrapper.setState({ username: 'myTestUsername' });
        wrapper.instance().handleCreateUsernameClick({ preventDefault: jest.fn() });

        expect(props.socket.emit).toHaveBeenCalledWith(constants.CREATE_USER, 'myTestUsername', expect.any(Function));
    });

    it ('handleCreateUsernameClick call updateError if no username entered', () => {
        wrapper.instance().handleCreateUsernameClick({ preventDefault: jest.fn() });

        expect(props.updateError).toHaveBeenCalledWith({
            visible: true,
            message: 'Username is required!'
        });
    });

    it ('createUserCallback should call createUsername if successful', () => {
        wrapper.setState({ username: 'testUsername' });
        wrapper.instance().createUserCallback({ created: true });

        expect(props.createUsername).toHaveBeenCalledWith('testUsername');
    });

    it ('createUserCallback should call updateError if error', () => {
        wrapper.instance().createUserCallback({ error: 'test error' });

        expect(props.updateError).toHaveBeenCalledWith({
            visible: true,
            message: 'test error'
        });
    });

    it ('updateUsersCallback calls updateUsers', () => {
        wrapper.instance().updateUsersCallback([]);

        expect(props.updateUsers).toHaveBeenCalledWith([]);
    });

    it ('receiveMessageCallback calls updateUsers', () => {
        wrapper.instance().receiveMessageCallback({
            message: 'test',
            to: 'myUsername',
            from: 'testUser'
        });
        
        expect(props.updateMessages).toHaveBeenCalledWith({
            message: 'test',
            to: 'myUsername',
            from: 'testUser'
        });
    });
});