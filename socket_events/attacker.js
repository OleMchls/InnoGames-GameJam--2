exports.events = function (socket) {
	socket.on('new_attacker_pos', function (data) {
		socket.broadcast.emit('update_attacker_pos', data);
		//socket.emit('update_attacker_pos', data);
	});

	socket.on('shoot_projectile', function(data) {
		socket.broadcast.emit('create_projectile', data);
	});
}