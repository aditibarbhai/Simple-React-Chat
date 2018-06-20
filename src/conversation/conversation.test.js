import React from 'react';
import { Conversation } from './conversation';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import constants from '../constants';

describe('Conversation', () => {
    let props = {};

    beforeEach(() => {
        props = {
            selectedUser: 'testUser',
            myUsername: 'myTestUsername',
            error: {
                visible: false,
                message: ''
            },
            socket: {
                emit: jest.fn()
            },
            messages: [],
            updateMessages: jest.fn(),
            updateError: jest.fn()
        };
    });

    it ('should render without errors', () => {
        const tree = renderer
            .create(<Conversation {...props} />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

    it ('submitMessage should send the message to selected user', () => {
        const wrapper = shallow(<Conversation {...props} />);

        wrapper.setState({ message: 'test message' });
        wrapper.instance().submitMessage({ preventDefault: jest.fn() });

        expect(props.socket.emit).toHaveBeenCalledWith(constants.SEND_MESSAGE, {
            message: 'test message',
            to: props.selectedUser,
            from: props.myUsername
        }, expect.any(Function));
        expect(wrapper.state().message).toBe('');
        expect(wrapper.state().newMessage).toBeDefined();
    });

    it ('sendMessageCallback should update messages if message sent', () => {
        const wrapper = shallow(<Conversation {...props} />);

        wrapper.instance().sendMessageCallback({ messageSent: true });

        expect(props.updateMessages).toHaveBeenCalledWith(expect.any(Object));
    });

    it ('sendMessageCallback should update error if message not sent', () => {
        const wrapper = shallow(<Conversation {...props} />);

        wrapper.instance().sendMessageCallback({ error: 'User disconnected' });

        expect(props.updateError).toHaveBeenCalledWith({ visible: true, message: 'User disconnected' });
    });

    it ('handleMessageChange should update state.message', () => {
        const wrapper = shallow(<Conversation {...props} />);

        expect(wrapper.state().message).toBe('');
        
        wrapper.instance().handleMessageChange({ target: { value: 'hello!' } });
        
        expect(wrapper.state().message).toBe('hello!');
    });

    it ('sshould update scroll position as new messages are added', () => {
        const wrapper = mount(<Conversation {...props} />),
            scrollSpy = jest.spyOn(Conversation.prototype, 'scrollToBottomOfMessages');
        
        wrapper.setProps({
            messages: [{
                message: 'test message',
                to: 'testUser',
                from: 'myUsername'
            }]
        });

        expect(scrollSpy).toHaveBeenCalled();
    });
});