hk.Game = function() {

	var that = this;
	var bg_pos = 0;
	var resources = [
		'/images/ship.png', '/images/dropzone.png', '/images/enemy1.png', '/images/enemy2.png',	'/images/enemy3.png',
		'/images/enemy4.png', '/images/enemy5.png'
	];

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

		that.scrollBackground();

		hk.player = Crafty.e("2D, DOM, Image, Collision, player")
			.attr({w: 15, h: 15, x: 43, y: 43, moving_key: 0})
			.image('/images/ship.png')
			.css('z-index', 100)
			.bind("KeyDown", function(e) {
				this.moving_key = e.keyCode;

				if (e.keyCode == Crafty.keys.SPACE) {
					that.shootProjectile(true);
				}
			})
			.bind("KeyUp", function(e) {
				this.moving_key = 0;
			})
			.bind("EnterFrame", function() {
				if (this.moving_key) {
					switch (this.moving_key) {
						case Crafty.keys.RIGHT_ARROW:
							this.x += 10;
							break;
						case Crafty.keys.LEFT_ARROW:
							this.x -= 10;
							break;
						case Crafty.keys.UP_ARROW:
							this.y -= 10;
							break;
						case Crafty.keys.DOWN_ARROW:
							this.y += 10;
							break;
						default:
							break;
					}

					// update position
					socket.emit('new_attacker_pos', {x: this.x, y: this.y});
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
	}

	this.scrollBackground = function() {
		bg_pos -= 2;
		$('#cr-stage').css('background-position', bg_pos);

		setTimeout(that.scrollBackground, 30);
	}

	this.shootProjectile = function(sync) {
		var projectile_x = hk.player.x + hk.player.w;
		var projectile_y = hk.player.y + (hk.player.h / 2) + 1;

		var projectile = Crafty.e('2D, DOM, Color, projectile')
			.attr({x: projectile_x, y: projectile_y, w: 5, h: 5})
			.color('#FF0000')
			.bind('EnterFrame', function() {
				this.x += 7;
			});

		if (sync) {
			// broadcast projectile
			socket.emit('shoot_projectile', {x: projectile.x, y: projectile.y});
		}
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
	})
}