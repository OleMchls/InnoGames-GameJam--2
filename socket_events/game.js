var game  = {
	roles: {},
	users: {
		visitor: []
	}
};
game.roles.ATTACKER = 'attacker';
game.roles.DEFENDER = 'defender';
game.roles.VISITOR = 'visitor';

exports.events = function (socket) {
	if (!game.users[game.roles.ATTACKER]) {
		game.users[game.roles.ATTACKER] = socket;
		socket.emit('role_update', {role: game.roles.ATTACKER})
	} else if (!game.users[game.roles.DEFENDER]) {
		game.users[game.roles.DEFENDER] = socket;
		socket.emit('role_update', {role: game.roles.DEFENDER})
	} else {
		game.users[game.roles.VISITOR].push(socket);
		socket.emit('role_update', {role: game.roles.VISITOR})
	}

	socket.on('myEvent', function (data) {
		console.log(data);
	});
	console.log(game)
}