hk.defender = function() {

	var that = this;
	this.selectedUnit = null;

	var units = {
		'enemy1': {price: 100},
		'enemy2': {price: 300},
		'enemy3': {price: 750},
		'enemy4': {price: 1000},
		'enemy5': {price: 1200}
	}

	this.init = function() {
		// dropzone
		var dropzone = Crafty.e("2D, DOM, Image, dropzone").
		attr({
			w: 160,
			h: Crafty.viewport.height,
			x: Crafty.viewport.width - 160,
			y: 0
		}).
		image("/images/dropzone.png").
		bind("KeyDown", function(e) {
			switch (e.keyCode) {
				case Crafty.keys['1']:
					that.selectUnit('enemy1')
					break;
				case Crafty.keys['2']:
					that.selectUnit('enemy2')
					break;
				case Crafty.keys['3']:
					that.selectUnit('enemy3')
					break;
				case Crafty.keys['4']:
					that.selectUnit('enemy4')
					break;
				case Crafty.keys['5']:
					that.selectUnit('enemy5')
					break;
			}
		})

		$(dropzone._element).bind('click.dropzone', function(event) {
			var x = event.clientX;
			var y = event.clientY;
			that.spawnUnit(that.selectedUnit, x, y, true);
		})

		$('#defender-controlls .enemy').bind('click.defender', function(event){
			that.selectUnit(event.currentTarget.id);
		})
	}

	this.selectUnit = function(unit_name) {
		if (hk.role != 'defender') {
			return
		}
		$('#attack-bar li').css('border', 'none')
		that.selectedUnit = unit_name;
		$('#'+unit_name).css('border', '2px dotted green')
	}

	this.spawnUnit = function(unit_name, x, y, sync) {
		var unit;
		var currentSink = parseInt($('#sink span').text());
		if (currentSink < units[unit_name].price) {
			return
		}
		switch (unit_name) {
			case 'enemy1':
				unit = Crafty.e("2D, Canvas, Image, Collision, HTML, enemy1")
				.attr({
					w: 72,
					h: 34,
					x: x,
					y: y
				})
				.image('/images/bomb1.png')
				.css('z-index', 100)
				.bind('EnterFrame', function() {
					this.x -= 1;
					if (this.x < 0 || this.y < 0 || this.x > Crafty.viewport.width || this.y > Crafty.viewport.height) {
						this.destroy();
					}
				})
				.collision()
				.onHit('projectile', function() {
					this.destroy();
				});
				break;
			case 'enemy2':
				unit = Crafty.e("2D, Canvas, Image, Collision, HTML, enemy2")
				.attr({
					w: 73,
					h: 29,
					x: x,
					y: y
				})
				.image('/images/bomb2.png')
				.css('z-index', 100)
				.bind('EnterFrame', function() {
					this.x -= 3;
					if (this.x < 0 || this.y < 0 || this.x > Crafty.viewport.width || this.y > Crafty.viewport.height) {
						this.destroy();
					}
				})
				.collision()
				.onHit('projectile', function() {
					this.destroy();
				});
				break;
			case 'enemy3':
				unit = Crafty.e("2D, Canvas, Image, Collision, HTML, enemy3")
				.attr({
					w: 144,
					h: 70,
					x: x,
					y: y
				})
				.image('/images/bomb3.png')
				.css('z-index', 100)
				.bind('EnterFrame', function() {
					if (hk.player.x < this.x)
						this.x -= 0.8;
					else
						this.x -= 1;
					if (hk.player.x < this.x) {
						if (hk.player.y > this.y)
							this.y += 1;
						else
							this.y -= 1;
					}
					if (this.x < 0 || this.y < 0 || this.x > Crafty.viewport.width || this.y > Crafty.viewport.height) {
						this.destroy();
					}
				})
				.collision()
				.onHit('projectile', function() {
					this.destroy();
				});
				break;
			case 'enemy4':
				unit = Crafty.e("2D, Canvas, Image, Collision, HTML, enemy4")
				.attr({
					w: 50,
					h: 50,
					x: x,
					y: y
				})
				.image('/images/bomb4.png')
				.css('z-index', 100)
				.bind('EnterFrame', function() {
					this.x -= 1;
					this.y -= rand(0,3)
					this.y += rand(0,3)
					if (this.x < 0 || this.y < 0 || this.x > Crafty.viewport.width || this.y > Crafty.viewport.height) {
						this.destroy();
					}
				})
				.collision()
				.onHit('projectile', function() {
					this.destroy();
				});
				break;
			case 'enemy5':
				unit = Crafty.e("2D, Canvas, Image, Collision, HTML, enemy5")
				.attr({
					w: 50,
					h: 50,
					x: x,
					y: y
				})
				.image('/images/bomb5.png')
				.css('z-index', 100)
				.bind('EnterFrame', function() {
					this.x -= 3;
					this.y -= rand(0,5)
					this.y += rand(0,5)
					if (this.x < 0 || this.y < 0 || this.x > Crafty.viewport.width || this.y > Crafty.viewport.height) {
						this.destroy();
					}
				})
				.collision()
				.onHit('projectile', function() {
					this.destroy();
				});
				break;
		}
		socket.emit('spend_sink', {value: units[unit_name].price});

		if (unit && sync) {
			socket.emit('send_enemy', {unit_name: unit_name, x: x, y: y});
		}
	}

	socket.on('create_enemy', function(data) {
		that.spawnUnit(data.unit_name, data.x, data.y, false);
	});

	socket.on('sink_update', function(data) {
		$('#sink span').text(data.sink)
	});
}