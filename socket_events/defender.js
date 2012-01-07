exports.events = function (socket) {
	socket.on('send_enemy', function (data) {
		socket.broadcast.emit('create_enemy', data);
	});
}