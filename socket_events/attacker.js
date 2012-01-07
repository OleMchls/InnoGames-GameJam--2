exports.events = function (socket) {
	socket.on('new_attacker_pos', function (data) {
		console.log(data);
	});
}