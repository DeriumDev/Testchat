const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the "public" directory
app.use(express.static('public'));

// Handle a new client connection
io.on('connection', (socket) => {
    console.log('New user connected');

    // Broadcast a message to everyone
    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', msg);
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));