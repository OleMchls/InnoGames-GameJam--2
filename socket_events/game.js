var game  = {
	roles: {},
	users: {
		attacker: null,
		defender: null,
		visitor: []
	}
};
game.roles.ATTACKER = 'attacker';
game.roles.DEFENDER = 'defender';
game.roles.VISITOR = 'visitor';

function cleanupRoles() {
	if (game.users.attacker && game.users.attacker.disconnected) {
		game.users.attacker = null;
	}
	if (game.users.defender && game.users.defender.disconnected) {
		game.users.defender = null;
	}
}

exports.events = function (socket) {
	cleanupRoles();

	if (!game.users[game.roles.ATTACKER]) {
		game.users[game.roles.ATTACKER] = socket;
		socket.emit('role_update', {
			role: game.roles.ATTACKER
			})
	} else if (!game.users[game.roles.DEFENDER]) {
		game.users[game.roles.DEFENDER] = socket;
		socket.emit('role_update', {
			role: game.roles.DEFENDER
			})
	} else {
		game.users[game.roles.VISITOR].push(socket);
		socket.emit('role_update', {
			role: game.roles.VISITOR
			})
	}

	socket.on('disconnect', function(data) {
		cleanupRoles();
	})

	socket.on('myEvent', function (data) {
		console.log(data);
	});

	cleanupRoles();
}