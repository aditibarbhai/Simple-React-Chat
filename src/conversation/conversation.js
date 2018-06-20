import React, { Component } from 'react';
import { connect } from 'react-redux';
import constants from '../constants';
import SendIcon from '@material-ui/icons/Send';
import { 
    FormControl,
    FormHelperText,
    Input,
    Button,
    List,
    ListItem,
    ListItemText,
    AppBar,
    Toolbar,
    Typography
} from '@material-ui/core';
import Face from '@material-ui/icons/Face';

import { sendMessage, updateMessages, updateError } from '../actions/chat-actions';
import './conversation.css';

export class Conversation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            newMessage: null
        };

        this.messagesRef = null;

        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.submitMessage = this.submitMessage.bind(this);
        this.scrollToBottomOfMessags = this.scrollToBottomOfMessages.bind(this);
        this.sendMessageCallback = this.sendMessageCallback.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.scrollToBottomOfMessages();
    }

    scrollToBottomOfMessages() {
        this.messagesRef.scrollTop = this.messagesRef.scrollHeight;
    }

    handleMessageChange(event) {
        this.setState({
            message: event.target.value
        });
    }

    sendMessageCallback(data) {
        if (data.messageSent) {
            this.props.updateMessages(this.state.newMessage);
        } else {
            this.props.updateError({
                visible: true,
                message: data.error
            });
        }
    }

    submitMessage(event) {
        event.preventDefault();
        
        if (this.state.message) {
            const newMessage = {
                message: this.state.message,
                to: this.props.selectedUser,
                from: this.props.myUsername
            };

            this.props.socket.emit(constants.SEND_MESSAGE, newMessage, this.sendMessageCallback);

            this.setState({
                message: '',
                newMessage
            });
        }
    }

    renderMessages(messages) {
        return messages
            .filter(message => message.from === this.props.selectedUser || message.to ===  this.props.selectedUser)
            .map((data, index) => {
                let styles = '';

                if (data.from !== this.props.myUsername) {
                    styles += ' friend-message ';
                }

                return (
                    <ListItem className={styles} key={index + data.to}>
                        <ListItemText>
                            <Typography variant="body1" gutterBottom align="left">
                                <strong> { data.from }: </strong> { data.message }
                            </Typography>
                        </ListItemText>
                    </ListItem>
                );
            });
    }

    render() {
        return (
            <div className="private-conversation">
                <AppBar className="header"> 
                    <Toolbar>
                        <Face className="face-icon" />
                        <Typography variant="title" color="inherit">
                        { this.props.selectedUser }
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div className="messages" ref={(el) => { this.messagesRef = el; }}>
                    <List dense={true}>
                        { this.renderMessages(this.props.messages) }
                    </List>
                </div>
                <div className="conversation-form-wrapper">
                    <form className="private-conversation-form">
                        <FormControl className="message-input">
                            <Input 
                                type="text" 
                                value={this.state.message}
                                onChange={this.handleMessageChange}
                            />
                            {
                                this.props.error.visible &&
                                <FormHelperText error={this.props.error.visible} > 
                                    { this.props.error.message } 
                                </FormHelperText>
                            }
                        </FormControl>
                        <FormControl className="send-message">
                            <Button 
                                className="send-button" 
                                color="primary" 
                                onClick={this.submitMessage}
                                type="submit"
                                variant="contained" 
                            >
                                Send
                                <SendIcon />
                            </Button>
                        </FormControl>
                    </form>
                </div>
            </div>
        );
    }
}

Conversation.propTypes = {};

const mapStateToProps = state => ({
    selectedUser: state.selectedUser,
    myUsername: state.myUsername,
    socket: state.socket,
    error: state.error,
    messages: state.messages
});

const mapDispatchToProps = dispatch => ({
    sendMessage: message => dispatch(sendMessage(message)),
    updateMessages: message => dispatch(updateMessages(message)),
    updateError: error => dispatch(updateError(error))
});

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);