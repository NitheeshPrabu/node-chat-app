require('./config/config')
const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');
const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

const { generateMessage, generateLocationMessage } = require('./utils/message');

app.use(express.static(publicPath));

io.on('connection', (socket) => {

	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and room name are required');
		}

		params.room = params.room.toLowerCase();
		params.name = params.name.toLowerCase();

		socket.join(params.room);
		users.removeUser(socket.id);
		let user, existing = users.addUser(socket.id, params.name, params.room);
		if (!existing) {
			io.to(params.room).emit('updateUserList', users.getUserList(params.room));

			socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
			// send to everyone except user
			socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined ${params.room}`));
			console.log(`${params.name} has joined ${params.room}`);
		} else {
			io.to(params.room).emit('updateUserList', users.getUserList(params.room));
			socket.emit('newMessage', generateMessage('Admin', 'Welcome back, you are already part of this room.'));
			socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has re-joined ${params.room}`));
			console.log(`${params.name} has re-joined ${params.room}`);
		}
		callback();
	});

	socket.on('createMessage', (message, callback) => {
		var user = users.getUser(socket.id);
		if (user && isRealString(message.text)) {
			io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
		}
		callback();
	});

	socket.on('createLocationMessage', (coords) => {
		var user = users.getUser(socket.id);
		if (user) {
			io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
		}
	});

	socket.on('disconnect', () => {
		var user = users.removeUser(socket.id);
		if (user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`));
			console.log(`${user.name} has left room ${user.room}`);
		}
	});
});

server.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});