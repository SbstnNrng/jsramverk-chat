const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
    console.info("User connected");
    socket.on('send message', body => {
        io.emit('message', body);
    });
    socket.off("send message");
});

server.listen(3000);
