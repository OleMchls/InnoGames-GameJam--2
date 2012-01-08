hk.Game = function() {

	var that = this;
	var bg_pos = 0;
	var resources = [
	'/images/ship.png', '/images/dropzone.png', '/images/bomb1.png', '/images/bomb2.png', '/images/bomb3.png',
	'/images/bomb4.png', '/images/bomb5.png', '/images/player.png'
	];
	var ticks_player_unsynced = 0;
	var projectile_cooldown = false;
	var projectiles = [];

	/**
	 * Initializes the game.
	 */
	this.init = function() {
		Crafty.load(resources, function() {
			//when loaded
			$('#cr_stage').text('');
			that.startGame();
		}, function(e) {
			$('#cr_stage').text(e.percent + '%');
		}, function(e) {
			// fail
			});
	}

	this.startGame = function() {
		Crafty.init(1400, 600);
		Crafty.canvas.init();

		var defender = new hk.defender();
		defender.init();

		that.scrollBackground();
		if (hk.role == 'attacker') {
			that.updatePosition();
		}

		hk.started = true;
	}

	this.createPlayer = function() {
		hk.player = Crafty.e("2D, DOM, Image, Collision, player")
		.attr({
			w: 15,
			h: 15,
			x: 43,
			y: 43,
			last_x: 43,
			last_y: 43,
			move: {
				left: false,
				right: false,
				up: false,
				down: false
			},
			upgrade: 1
		})
		.image('/images/player_1.png')
		.css('z-index', 100)
		.bind("KeyDown", function(e) {
			if (e.keyCode && hk.role == 'attacker') {
				switch (e.keyCode) {
					case Crafty.keys.RIGHT_ARROW:
						this.move.right = true;
						break;
					case Crafty.keys.LEFT_ARROW:
						this.move.left = true;
						break;
					case Crafty.keys.UP_ARROW:
						this.move.up = true;
						break;
					case Crafty.keys.DOWN_ARROW:
						this.move.down = true;
						break;
					case Crafty.keys.SPACE:
						that.shootProjectile();
						break;
					default:
						break;
				}
			}
		})
		.bind("KeyUp", function(e) {
			switch (e.keyCode) {
				case Crafty.keys.RIGHT_ARROW:
					this.move.right = false;
					break;
				case Crafty.keys.LEFT_ARROW:
					this.move.left = false;
					break;
				case Crafty.keys.UP_ARROW:
					this.move.up = false;
					break;
				case Crafty.keys.DOWN_ARROW:
					this.move.down = false;
					break;
				default:
					break;
			}
		})
		.bind("EnterFrame", function() {
			if (this.move.right) {
				this.x += 10;
			}
			if (this.move.left) {
				this.x -= 10;
			}
			if (this.move.up) {
				this.y -= 10;
			}
			if (this.move.down) {
				this.y += 10;
			}

			// prevent player from moving outsite the map
			if (this.x < 0) {
				this.x = 0;
			}
			if (this.y < 0) {
				this.y = 0;
			}
			if (this.y > Crafty.viewport.height - this.h) {
				this.y = Crafty.viewport.height - this.h;
			}
			if (this.x > Crafty.viewport.width - 160 - this.w) {
				this.x = Crafty.viewport.width - 160 - this.w;
			}
		})
		.collision()
		.onHit('enemy1', function(data) {
			if (hk.role == 'attacker') {
				socket.emit('attacker_hit', {id: data[0].obj.unit_id, score: $('#timer span').text()});
			}
			//this.destroy();
		})
		.onHit('enemy2', function(data) {
			if (hk.role == 'attacker') {
				socket.emit('attacker_hit', {id: data[0].obj.unit_id, score: $('#timer span').text()});
			}
			//this.destroy();
		})
		.onHit('enemy3', function(data) {
			if (hk.role == 'attacker') {
				socket.emit('attacker_hit', {id: data[0].obj.unit_id, score: $('#timer span').text()});
			}
			//this.destroy();
		})
		.onHit('enemy4', function(data) {
			if (hk.role == 'attacker') {
				socket.emit('attacker_hit', {id: data[0].obj.unit_id, score: $('#timer span').text()});
			}
			//this.destroy();
		})
		.onHit('enemy5', function(data) {
			if (hk.role == 'attacker') {
				socket.emit('attacker_hit', {id: data[0].obj.unit_id, score: $('#timer span').text()});
			}
			//this.destroy();
		});
	}

	this.scrollBackground = function() {
		bg_pos -= 2;
		$('#cr-stage').css('background-position', bg_pos);

		setTimeout(that.scrollBackground, 30);
	}

	this.shootProjectile = function() {
		if (projectile_cooldown) {
			return;
		}

		var projectile_x = hk.player.x + hk.player.w;
		var projectile_y = 0;

		switch (hk.player.upgrade) {
			case 1:
			case 2:
			case 3:
				projectile_y = hk.player.y + (hk.player.h / 2) + 2;
				break;
			case 4:
				projectile_y = hk.player.y + (hk.player.h / 2) - 2;
				break;
			case 5:
				projectile_y = hk.player.y + (hk.player.h / 2) + 16;
				break;
		}

		socket.emit('shoot_projectile', {
			x: projectile_x,
			y: projectile_y
		});

		projectile_cooldown = true;
		setTimeout(that.clearProjectileCooldown, 300);
	}

	this.clearProjectileCooldown = function() {
		projectile_cooldown = false;
	}

	this.updatePosition = function() {
		if (hk.player && (hk.player.last_x != hk.player.x || hk.player.last_y != hk.player.y || ticks_player_unsynced >= 20)) {
			socket.emit('new_attacker_pos', {
				x: hk.player.x,
				y: hk.player.y
			});
			ticks_player_unsynced = 0;

			hk.player.last_x = hk.player.x;
			hk.player.last_y = hk.player.y;
		} else {
			ticks_player_unsynced++;
		}

		setTimeout(that.updatePosition, 35);
	}

	socket.on('update_attacker_pos', function(data) {
		if (hk.player) {
			hk.player.x = data.x;
			hk.player.y = data.y;
		}
	});

	socket.on('create_projectile', function(data) {
		var projectile = Crafty.e('2D, DOM, Image, Collision, projectile')
		.attr({
			x: data.x,
			y: data.y,
			w: 23,
			h: 4,
			damage: 1000,
			projectile_id: data.id
		})
		.image('/images/schuss1.png')
		.collision()
		.onHit('enemy2', function() {
			socket.emit('projectile_down', {
				id: data.id
				});
		})
		.onHit('enemy3', function() {
			socket.emit('projectile_down', {
				id: data.id
				});
		})
		.onHit('enemy4', function() {
			socket.emit('projectile_down', {
				id: data.id
				});
		})
		.onHit('enemy5', function() {
			socket.emit('projectile_down', {
				id: data.id
				});
		});

		projectiles.push({
			id: data.id,
			projectile: projectile
		});
	});

	socket.on('update_projectile_pos', function(data) {
		for (var i in projectiles) {
			if (projectiles[i].id == data.id) {
				projectiles[i].projectile.x = data.x;
			}
		}
	});

	socket.on('projectile_destroyed', function(data) {
		for (var i in projectiles) {
			if (projectiles[i].id == data.id) {
				projectiles[i].projectile.destroy();
			}
		}
	});

	socket.on('role_update', function(data) {
		hk.role = data.role;
		$('#role span').text(data.role)

		var pollGameStarted = function() {
			if (!hk.started) {
				setTimeout(pollGameStarted, 50);
			} else {
				Crafty('player').destroy();
				that.createPlayer();

				if (hk.role == 'attacker') {
					that.updatePosition();
				}
			}
		}
		pollGameStarted();
	})

	socket.on('state_change', function(state) {
		switch (state) {
			case 'waiting_for_players':
				break;
			case 'waiting_for_defender':
				hk.notification('Waiting for Defender!');
				break;
			case 'first_round':
				socket.emit('reset_game');
				$('#timer span').stopwatch({
					updateInterval: 10
				}).stopwatch('start');
				$('#health').text(100);
				hk.notification('Start');
				if (hk.role == 'attacker'){
					hk.notification('You are ATTACKER!');
				} else if (hk.role == 'defender') {
					hk.notification('You are DEFENDER!');
				} else {
					hk.notification('Start!');
				}
				break;
			case 'back_round':
				socket.emit('reset_game');
				$('#timer span').stopwatch({
					updateInterval: 10
				}).stopwatch('start');
				$('#health').text(100);
				hk.notification('Switching sides');
				if (hk.role == 'attacker'){
					hk.notification('You are ATTACKER!');
				} else if (hk.role == 'defender') {
					hk.notification('You are DEFENDER!');
				} else {
					hk.notification('Start!');
				}
				break;
			case 'attacker_win':
				if (hk.role == 'attacker'){
					hk.notification('You WON!', 5000);
				} else if (hk.role == 'defender') {
					hk.notification('You Lost :(', 5000);
				} else {
					hk.notification('Attacker won the Game!', 5000);
				}
				break;
			case 'attacker_lost':
				if (hk.role == 'defender'){
					hk.notification('You WON!', 5000);
				} else if (hk.role == 'attacker') {
					hk.notification('You Lost :(', 5000);
				} else {
					hk.notification('Defender won the Game!', 5000);
				}
				break;
		}

	})

	socket.on('update_health', function(data) {
		$('#health').text(data.health);
	});

	socket.on('upgrade_attacker', function(data) {
		hk.player.image('/images/player_' + data.upgrade + '.png');
		hk.player.upgrade = data.upgrade;
	});
}