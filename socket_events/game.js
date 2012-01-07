var game  = {
	roles: {
		ATTACKER: 'attacker',
		DEFENDER: 'defender',
		VISITOR: 'visitor'
	},
	users: {
		attacker: null,
		defender: null,
		visitor: []
	},
	states: {
		WAITING_FOR_PLAYERS: 'waiting_for_players',
		WAITING_FOR_DEFENDER: 'waiting_for_defender',
		FIRST_ROUND: 'first_round',
		BACK_ROUND: 'back_round',
		ATTACKER_WIN: 'attacker_win',
		ATTACKER_LOST: 'attacker_lost'
	},
	state: game.states.WAITING_FOR_PLAYERS
};

function cleanupRoles() {
	if (game.users.attacker && game.users.attacker.disconnected) {
		game.users.attacker = null;
		game.state = game.states.WAITING_FOR_PLAYERS
	}
	if (game.users.defender && game.users.defender.disconnected) {
		game.users.defender = null;
		game.state = game.states.WAITING_FOR_DEFENDER
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