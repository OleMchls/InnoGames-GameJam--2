var game  = {
	roles: {},
	users: {
		attacker: null,
		defender: null,
		visitor: []
	},
	attacker_pos: {x: 43, y: 43},
	projectiles: [],
	units: [],
	unit_count: 1,
	viewport_w: 1400,
	viewport_h: 600
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

function broadcastAttackerPos() {
	if (game.users.attacker) {
		game.users[game.roles.ATTACKER].broadcast.emit('update_attacker_pos', game.attacker_pos);
	}
}

function broadcastProjectileDestroy(projectile) {
	if (game.users.attacker) {
		game.users[game.roles.ATTACKER].broadcast.emit('projectile_destroyed', projectile);
		game.users[game.roles.ATTACKER].emit('projectile_destroyed', projectile);
	}
}

function broadcastProjectilesPos() {
	for (var i in game.projectiles) {
		var projectile = game.projectiles[i];
		projectile.x += 15;

		if (projectile.x > game.viewport_w) {
			broadcastProjectileDestroy(projectile);
			game.projectiles.splice(i, 1);
			continue;
		}

		if (game.users.attacker) {
			game.users[game.roles.ATTACKER].broadcast.emit('update_projectile_pos', projectile);
			game.users[game.roles.ATTACKER].emit('update_projectile_pos', projectile);
		}
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

	// sync
	socket.on('new_attacker_pos', function (data) {
		if (socket != game.users[game.roles.ATTACKER]) {
			return;
		}

		game.attacker_pos.x = data.x;
		game.attacker_pos.y = data.y;

		console.log(game.attacker_pos);

		//socket.broadcast.emit('update_attacker_pos', data);
	});
	socket.on('shoot_projectile', function(data) {
		if (socket != game.users[game.roles.ATTACKER]) {
			return;
		}

		game.projectiles.push({id: game.unit_count, x: data.x, y: data.y});
		socket.broadcast.emit('create_projectile', {id: game.unit_count, x: data.x, y: data.y});
		socket.emit('create_projectile', {id: game.unit_count, x: data.x, y: data.y});
		game.unit_count++;

		console.log(game.projectiles);
	});
	socket.on('send_enemy', function (data) {
		if (socket != game.users[game.roles.DEFENDER]) {
			return;
		}

		game.units.push({x: data.x, y: data.y});

		console.log(game.units);

		socket.broadcast.emit('create_enemy', data);
	});

	setInterval(broadcastAttackerPos, 35);
	setInterval(broadcastProjectilesPos, 35);

	cleanupRoles();
}