const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server, {
	cors: {
    origin: '*',
  }
});

const users = {};

const socketToRoom = {};

io.on('connection', (socket) => {
	console.log('connected');

	socket.on('disconnect', () => {
		console.log('disconnecting');
		const roomID = socketToRoom[socket.id];
		let room = users[roomID];
		if (room) {
			room = room.filter(id => id !== socket.id);
			users[roomID] = room;
		}
		io.emit("user exited", socket.id);
	});

	socket.on('sendmsg', (data) => {
		console.log(data)
	});

	socket.on("join room", (roomID, userId, userEmail) => {
		console.log('join room');
		console.log(userId);
		console.log(userEmail);

		if (users[roomID]) {
			const length = users[roomID].length;
			if (length === 30) {
				socket.emit("room full");
				return;
			}
			users[roomID].push(socket.id);
		} else {
			users[roomID] = [socket.id];
		}
		socketToRoom[socket.id] = roomID;
		const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

		socket.emit("all users", usersInThisRoom, userId, userEmail, socket.id);
	});

	socket.on("sending signal", (payload) => {
		console.log('sending signal');
		console.log(payload.userId);
		console.log(payload.userEmail);

		io.to(payload.userToSignal)
			.emit('user joined', 
				{ signal: payload.signal, callerID: payload.callerID },
				payload.userId,
				payload.userEmail
			);
	});

	socket.on("returning signal", payload => {
		console.log('returning signal');
		io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
	});
});

server.listen(8081, () => console.log('server is running on port 8081'));