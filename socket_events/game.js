var start_sink = 15000;
var start_growth = 2000;

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
	state: null,
	attacker_pos: {
		x: 43,
		y: 43
	},
	attacker_health: 100,
	projectiles: [],
	projectiles_hit: [],
	units: [],
	unit_count: 1,
	viewport_w: 1400,
	viewport_h: 600,
	ai: null,
	sink: start_sink,
	growth: start_growth
};

game.state = game.states.WAITING_FOR_PLAYERS;
game.ai = require('../ai.js').ai();

var units = {
	'enemy1': {
		price: 1000,
		growth: 100,
		life: 1000,
		damage: 2
	},
	'enemy2': {
		price: 3000,
		growth: 220,
		life: 1000,
		damage: 5
	},
	'enemy3': {
		price: 7500,
		growth: 350,
		life: 2000,
		damage: 10
	},
	'enemy4': {
		price: 10000,
		growth: 400,
		life: 3000,
		damage: 15
	},
	'enemy5': {
		price: 20000,
		growth: 500,
		life: 5000,
		damage: 20
	}
}

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
		projectile.x += 30;

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

function broadcastUnitsPos() {
	for (var i in game.units) {
		var unit = game.units[i];

		if (unit.x > game.viewport_w) {
			// TODO: broadcast health
			//broadcastUnitDestroy(unit);
			game.units.splice(i, 1);
			continue;
		}

		var data = {
			x: unit.x,
			y: unit.y,
			player: game.attacker_pos
			};
		switch (unit.unit_name) {
			case 'enemy1':
				data = game.ai.enemy1(data);
				break;
			case 'enemy2':
				data = game.ai.enemy2(data);
				break;
			case 'enemy3':
				data = game.ai.enemy3(data);
				break;
			case 'enemy4':
				data = game.ai.enemy4(data);
				break;
			case 'enemy5':
				data = game.ai.enemy5(data);
				break;
		}

		if (data.x < 0 || data.y < 0 || data.x > game.viewport_w || data.y > game.viewport_h) {
			if (data.x < 0) {
				game.sink += units[unit.unit_name].price * 2;
				updateSink();
			}

			game.units.splice(i, 1);

			if (game.users.defender) {
				game.users[game.roles.DEFENDER].broadcast.emit('unit_down', {
					id: unit.id
					});
				game.users[game.roles.DEFENDER].emit('unit_down', {
					id: unit.id
					});
			}
		} else {
			unit.x = data.x;
			unit.y = data.y;

			if (game.users.defender) {
				game.users[game.roles.DEFENDER].broadcast.emit('update_unit_pos', unit);
				game.users[game.roles.DEFENDER].emit('update_unit_pos', unit);
			}
		}
	}
}

function broadcastAttackerHealth() {
	if (game.users.attacker) {
		game.users[game.roles.ATTACKER].emit('update_health', {
			health: game.attacker_health
			});
		game.users[game.roles.ATTACKER].broadcast.emit('update_health', {
			health: game.attacker_health
			});
	}
}

function hasProjectileHit(id) {
	var hit = false;
	for (var i in game.projectiles_hit) {
		if (game.projectiles_hit[i].id == id) {
			hit = true;
		}
	}

	return hit;
}

function changeGameState(socket, state) {
	game.state = state;
	socket.emit('state_change', state);
	socket.broadcast.emit('state_change', state);
	game.attacker_health = 100;
}

function updateSink() {
	var data = {
		sink: game.sink,
		growth: game.growth
		};

	if (game.users.defender) {
		game.users[game.roles.DEFENDER].emit('sink_update', data);
		game.users[game.roles.DEFENDER].broadcast.emit('sink_update', data);
	} else if(game.users.attacker) {
		game.users[game.roles.ATTACKER].emit('sink_update', data);
		game.users[game.roles.ATTACKER].broadcast.emit('sink_update', data);
	}
}

function checkAttackerUpgrade() {
	var last = game.users[game.roles.ATTACKER].upgrade;

	switch (game.users[game.roles.ATTACKER].kills) {
		case 25:
			game.users[game.roles.ATTACKER].upgrade = 2;
			break;
		case 50:
			game.users[game.roles.ATTACKER].upgrade = 3;
			break;
		case 100:
			game.users[game.roles.ATTACKER].upgrade = 4;
			break;
		case 200:
			game.users[game.roles.ATTACKER].upgrade = 5;
			break;
	}

	if (game.users[game.roles.ATTACKER].upgrade > last) {
		game.users[game.roles.ATTACKER].emit('upgrade_attacker', {
			upgrade: game.users[game.roles.ATTACKER].upgrade
			});
		game.users[game.roles.ATTACKER].broadcast.emit('upgrade_attacker', {
			upgrade: game.users[game.roles.ATTACKER].upgrade
			});
	}
}

setInterval(broadcastAttackerPos, 35);
setInterval(broadcastProjectilesPos, 35);
setInterval(broadcastUnitsPos, 35);

exports.events = function (socket) {
	cleanupRoles();

	if (!game.users[game.roles.ATTACKER]) {
		game.users[game.roles.ATTACKER] = socket;
		game.users[game.roles.ATTACKER].kills = 0;
		game.users[game.roles.ATTACKER].upgrade = 1;
		changeGameState(socket, game.states.WAITING_FOR_DEFENDER)
		socket.emit('role_update', {
			role: game.roles.ATTACKER
		})
	} else if (!game.users[game.roles.DEFENDER]) {
		game.users[game.roles.DEFENDER] = socket;
		game.users[game.roles.DEFENDER].kills = 0;
		game.users[game.roles.DEFENDER].upgrade = 1;
		changeGameState(socket, game.states.FIRST_ROUND)
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

	// sync
	socket.on('new_attacker_pos', function (data) {
		if (socket != game.users[game.roles.ATTACKER]) {
			return;
		}

		game.attacker_pos.x = data.x;
		game.attacker_pos.y = data.y;
	});
	socket.on('shoot_projectile', function(data) {
		if (socket != game.users[game.roles.ATTACKER]) {
			return;
		}

		game.projectiles.push({
			id: game.unit_count,
			x: data.x,
			y: data.y
			});
		socket.broadcast.emit('create_projectile', {
			id: game.unit_count,
			x: data.x,
			y: data.y
			});
		socket.emit('create_projectile', {
			id: game.unit_count,
			x: data.x,
			y: data.y
			});
		game.unit_count++;
	});
	socket.on('spawn_unit', function (data) {
		if (socket != game.users[game.roles.DEFENDER] || game.sink < units[data.unit_name].price) {
			return;
		}

		game.sink -= units[data.unit_name].price;
		game.growth += units[data.unit_name].growth;
		updateSink();

		game.units.push({
			id: game.unit_count,
			unit_name: data.unit_name,
			life: units[data.unit_name].life,
			x: data.x,
			y: data.y
			});
		socket.broadcast.emit('create_unit', {
			id: game.unit_count,
			unit_name: data.unit_name,
			x: data.x,
			y: data.y
			});
		socket.emit('create_unit', {
			id: game.unit_count,
			unit_name: data.unit_name,
			x: data.x,
			y: data.y
			});
		game.unit_count++;
	});

	socket.on('unit_hit', function(data) {
		for (var i in game.units) {
			if (game.units[i].id == data.id && !hasProjectileHit(data.projectile_id)) {
				if (game.units[i].unit_name != 'enemy1') {
					game.projectiles_hit.push({
						id: data.projectile_id
						});
				}

				game.units[i].life -= data.damage;

				if (game.units[i].life < 1) {
					game.units.splice(i, 1);

					socket.broadcast.emit('unit_down', {
						id: data.id,
						shooted: true
					});
					socket.emit('unit_down', {
						id: data.id,
						shooted: true
					});

					game.users.attacker.kills++;
					checkAttackerUpgrade();
				}
			}
		}
	});
	socket.on('projectile_down', function(data) {
		for (var i in game.projectiles) {
			if (game.projectiles[i].id == data.id) {
				broadcastProjectileDestroy(game.projectiles[i]);
			}
		}
	});

	function extractMillisFromScore(scoreString) {
		var result = /(\d{2}):(\d{2}):(\d{3})/.exec(scoreString);
		var min = parseInt(result[1])
		,   sec = parseInt(result[2])
		,   mil = parseInt(result[3]);

		sec += (min * 60);
		mil += (sec * 1000);

		return mil;
	}

	function killAttacker(score) {
		for (var i in game.units) {
			socket.broadcast.emit('unit_down', {
				id: game.units[i].id
				});
			socket.emit('unit_down', {
				id: game.units[i].id
				});
		}
		game.units = [];

		game.users.attacker.score = score;
		if (game.state == game.states.FIRST_ROUND) {
			var ex_attacker = game.users.attacker;
			var ex_defender = game.users.defender;
			game.users.attacker = ex_defender;
			game.users.defender = ex_attacker;
			game.users.attacker.emit('role_update', {
				role: game.roles.ATTACKER
			})
			game.users.defender.emit('role_update', {
				role: game.roles.DEFENDER
			})
			changeGameState(socket, game.states.BACK_ROUND);
		} else if (game.state == game.states.BACK_ROUND) {
			var attacker_score = extractMillisFromScore(game.users.attacker.score);
			var defender_score = extractMillisFromScore(game.users.defender.score);
			if (attacker_score > defender_score) {
				changeGameState(socket, game.states.ATTACKER_WIN);
			} else {
				changeGameState(socket, game.states.ATTACKER_LOST);
			}
		}
	}

	socket.on('attacker_hit', function(data) {
		for (var i in game.units) {
			if (game.units[i] != undefined && game.units[i].id == data.id) {
				game.attacker_health -= units[game.units[i].unit_name].damage;
				game.attacker_health = Math.max(0, game.attacker_health);
				broadcastAttackerHealth();

				game.units.splice(i, 1);
				socket.broadcast.emit('unit_down', {
					id: data.id
					});
				socket.emit('unit_down', {
					id: data.id
					});

				if (game.attacker_health < 1) {
					killAttacker(data.score);
				}
			}
		}
	});

	socket.on('end_reached', function (data) {
		game.sink += parseInt(data.refund);
		updateSink();
	});

	socket.on('reset_game', function() {
		game.sink = start_sink;
		game.growth = start_growth;
		updateSink();
		socket.emit('reset_game');
		socket.broadcast.emit('reset_game')
	});

	cleanupRoles();
	updateSink();
}

setInterval(function() {
	game.sink += game.growth;
	updateSink();
}, 5000);