import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import constants from '../constants';
import PersonIcon from '@material-ui/icons/Person';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { 
    CssBaseline,
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText,
    FormControl,
    FormHelperText,
    Input,
    InputAdornment,
    Button
} from '@material-ui/core';

import { 
    updateSelectedUser, 
    createUsername, 
    updateUsers, 
    updateError,
    updateSocket,
    updateMessages
} from '../actions/chat-actions';
import Conversation from '../conversation/conversation';
import './chat.css';

export class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: ''
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleCreateUsernameClick = this.handleCreateUsernameClick.bind(this);
        this.selectUser = this.selectUser.bind(this);
        this.updateUsersCallback = this.updateUsersCallback.bind(this);
        this.receiveMessageCallback = this.receiveMessageCallback.bind(this);
        this.createUserCallback = this.createUserCallback.bind(this);
        
        const socket = io(`http://localhost:${constants.PORT}`);
        
        socket.on(constants.USERNAMES, this.updateUsersCallback);
        socket.on(constants.RECEIVE_MESSAGE, this.receiveMessageCallback);
        
        props.updateSocket(socket);
    }

    updateUsersCallback(usernames) {
        this.props.updateUsers(usernames);
    }

    receiveMessageCallback(message) {
        this.props.updateMessages(message);
    }

    selectUser(event) {
        this.props.updateSelectedUser(event.target.textContent);
    }

    renderUserList(users) {
        let connectedUsers = users.filter(user => user !== this.props.myUsername);

        if (connectedUsers.length > 0) {
            return connectedUsers.map((user, index) => {
                let selected = false,
                    icon = <PersonOutlineIcon />

                if (user === this.props.selectedUser) {
                    selected = true;
                    icon = <PersonIcon />;
                }

                const styles = selected ? 'user selected' : 'user';

                return (
                    <ListItem selected={selected} className={styles} key={user + index} button>
                        <ListItemIcon>
                            { icon }
                        </ListItemIcon>
                        <ListItemText onClick={this.selectUser} primary={user} />
                    </ListItem>
                );
            });
        } else {
            return (
                <ListItem className="user" button>
                    <ListItemText primary="No other users connected" />
                </ListItem>
            );
        }
    }

    handleUsernameChange(event) {
        this.setState({
            username: event.target.value.trim()
        });
    }

    createUserCallback(response) {
        if (response.created) {
            this.props.createUsername(this.state.username);
        } else {
            this.props.updateError({
                visible: true,
                message: response.error
            });
        }
    }

    handleCreateUsernameClick(event) {
        event.preventDefault();
        if (this.state.username) {
            this.props.socket.emit(constants.CREATE_USER, this.state.username, this.createUserCallback);
        } else {
            this.props.updateError({
                visible: true,
                message: 'Username is required!'
            });
        }
    }

    render() {
        return (
            <div>
                <CssBaseline />
                {
                    !this.props.myUsername &&
                    <div className="create-username-wrapper">
                        <h1> Welcome to SimpleChat! </h1>
                        <p> To get started, create a username: </p>
                        <form id="createUsername">
                            <FormControl className="form-control" >
                                <Input
                                    id="username"
                                    className="full-width" 
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    }
                                    value={this.state.username}
                                    onChange={this.handleUsernameChange}
                                    error={this.props.error.visible}
                                />
                                {
                                    this.props.error.visible &&
                                    <FormHelperText error={this.props.error.visible} > 
                                        { this.props.error.message } 
                                    </FormHelperText>
                                }
                            </FormControl>
                            <FormControl className="form-control">
                                 <Button 
                                    className="full-width" 
                                    onClick={this.handleCreateUsernameClick} 
                                    type="submit"
                                    variant="outlined" 
                                >
                                    Create
                                </Button>
                            </FormControl>
                        </form>
                    </div>
                }
                {
                    this.props.myUsername &&
                    <div className="chat-wrapper">
                        <div className="users">
                            <h2>Connected Users </h2>
                            <List className="users-list" component="nav">
                                { this.renderUserList(this.props.users) }
                            </List>
                        </div>
                        <div className="conversation">
                            {
                                this.props.selectedUser &&
                                <Conversation />
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }
}

Chat.propTypes = {};

const mapStateToProps = state => ({
    selectedUser: state.selectedUser,
    myUsername: state.myUsername,
    users: state.users,
    error: state.error,
    socket: state.socket
});

const mapDispatchToProps = dispatch => ({
    updateSelectedUser: user => dispatch(updateSelectedUser(user)),
    createUsername: username => dispatch(createUsername(username)),
    updateUsers: users => dispatch(updateUsers(users)),
    updateError: error => dispatch(updateError(error)),
    updateSocket: socket => dispatch(updateSocket(socket)),
    updateMessages: message => dispatch(updateMessages(message))
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);