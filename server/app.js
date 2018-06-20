const express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    PORT = 8080,
    connectedUsers = {},
    events = require('../src/constants'),
    path = require('path');

module.exports = server.listen(PORT);
console.log('Listening on port ' + PORT);

io.on(events.connection, socket => {
    socket.on(events.CREATE_USER, (username, callback) => {
        if (username in connectedUsers) {
            callback({ created: false, error: 'Username already exists. Try again.' });
        } else {
            socket.username = username;
            connectedUsers[username] = socket;
            updateUsernames(Object.keys(connectedUsers));
            callback({ created: true });
        }
    });

    socket.on(events.SEND_MESSAGE, (data, callback) => {
        let message = data.message.trim();

        if (connectedUsers[data.to]) {
            connectedUsers[data.to].emit(events.RECEIVE_MESSAGE, {
                message,
                from: data.from,
                to: data.to
            });
    
            callback({ messageSent: true });
        } else {
            console.log('user disconnected');
            callback({ messageSent: false, error: 'User no longer available.' });
        }
    });

    socket.on(events.disconnect, data => {
        if (socket.username) {
            delete connectedUsers[socket.username];
            updateUsernames(Object.keys(connectedUsers));
        }
        return;
    })
});

const updateUsernames = (usernamesList) => {
    io.sockets.emit(
        events.USERNAMES, 
        usernamesList
    );
}