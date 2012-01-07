exports.events = function (socket) {
	socket.on('new_defender_pos', function (data) {
		console.log(data);
	});
}