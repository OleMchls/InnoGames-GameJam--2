exports.events = function (socket) {
	socket.on('new_attacker_pos', function (data) {
		console.log(data);

		socket.broadcast.emit('update_attacker_pos', data);
		//socket.emit('update_attacker_pos', data);
	});
}