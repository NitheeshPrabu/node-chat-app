require('./config/config')
const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const { generateMessage, generateLocationMessage } = require('./utils/message');

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));

	// send to everyone except user
	socket.broadcast.emit('newMessage', generateMessage('Admin','New user joined'));

	socket.on('createMessage', (message, callback) => {
		console.log('createMessage', message);

		io.emit('newMessage', generateMessage(message.from,message.text));
		callback('This is from the server');
	});

	socket.on('createLocationMessage', (coords) => {
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
	});

	socket.on('disconnect', () => {
		console.log('User disconnected');
	});
});

server.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});