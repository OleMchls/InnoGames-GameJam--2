hk.Game = function() {

	var that = this;
	var bg_pos = 0;
	var resources = [
	'/images/ship.png', '/images/dropzone.png', '/images/bomb1.png', '/images/bomb2.png', '/images/bomb3.png',
	'/images/bomb4.png', '/images/bomb5.png'
	];
	var ticks_player_unsynced = 0;
	var projectile_cooldown = false;

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
			}
		})
	.image('/images/player.png')
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
					that.shootProjectile(true);
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
	.onHit('enemy1', function() {
		this.destroy();
	})
	.onHit('enemy2', function() {
		this.destroy();
	})
	.onHit('enemy3', function() {
		this.destroy();
	})
	.onHit('enemy4', function() {
		this.destroy();
	})
	.onHit('enemy5', function() {
		this.destroy();
	});

	var defender = new hk.defender();
	defender.init();

	that.scrollBackground();
	if (hk.role == 'attacker') {
		that.updatePosition();
	}

	$('#timer span').stopwatch({updateInterval: 10}).stopwatch('start')
}

this.scrollBackground = function() {
	bg_pos -= 2;
	$('#cr-stage').css('background-position', bg_pos);

	setTimeout(that.scrollBackground, 30);
}

this.shootProjectile = function(sync) {
	if (projectile_cooldown) {
		return;
	}

	var projectile_x = hk.player.x + hk.player.w;
	var projectile_y = hk.player.y + (hk.player.h / 2) + 2;

	var projectile = Crafty.e('2D, DOM, Image, projectile')
		.attr({
			x: projectile_x,
			y: projectile_y,
			w: 23,
			h: 4,
			damage: 1000
		})
		.image('/images/schuss1.png')
		.bind('EnterFrame', function() {
			this.x += 7;
		})
		.bind('EnterFrame', function() {
			if (this.x > Crafty.viewport.width) {
				this.destroy();
			}
		});

	if (sync) {
		// broadcast projectile
		socket.emit('shoot_projectile', {
			x: projectile.x,
			y: projectile.y
			});
	}

	projectile_cooldown = true;
	setTimeout(that.clearProjectileCooldown, 300);
}

this.clearProjectileCooldown = function() {
	projectile_cooldown = false;
}

this.updatePosition = function() {
	if (hk.player.last_x != hk.player.x || hk.player.last_y != hk.player.y || ticks_player_unsynced >= 20) {
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
	hk.player.x = data.x;
	hk.player.y = data.y;
});

socket.on('create_projectile', function(data) {
	that.shootProjectile(false);
});

socket.on('role_update', function(data) {
	hk.role = data.role;
	$('#role span').text(data.role)
})
}