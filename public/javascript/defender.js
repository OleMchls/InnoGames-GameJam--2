hk.defender = function() {

	var that = this;
	this.selectedUnit = null;

	var units = {
		'enemy1': {
			price: 1000,
			growth: 100,
			life: 1000
		},
		'enemy2': {
			price: 3000,
			growth: 220,
			life: 1000
		},
		'enemy3': {
			price: 7500,
			growth: 350,
			life: 2000
		},
		'enemy4': {
			price: 10000,
			growth: 400,
			life: 3000
		},
		'enemy5': {
			price: 20000,
			growth: 500,
			life: 5000
		}
	}
	var spawned_units = [];

	this.init = function() {
		// dropzone
		var dropzone = Crafty.e("2D, DOM, Image, Mouse, dropzone").
		attr({
			w: 160,
			h: 485,
			x: 1216,
			y: 47
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

		$('#hidden-dropzone').bind('click.dropzone', function(event) {
			var x = event.offsetX + 1229;
			var y = event.offsetY + 30;
			that.spawnUnit(that.selectedUnit, x, y);
		})

		$('#attack-bar .enemy').bind('click.defender', function(event){
			that.selectUnit(event.currentTarget.id);
		})
	}

	this.selectUnit = function(unit_name) {
		if (hk.role != 'defender') {
			return
		}
		$('#attack-bar div').removeClass('active')
		that.selectedUnit = unit_name;
		$('#'+unit_name).addClass('active')
	}

	this.spawnUnit = function(unit_name, x, y) {
		socket.emit('spawn_unit', {unit_name: unit_name, x: x, y: y});
	}

	socket.on('create_unit', function(data) {
		var unit = null;
		var unit_id = data.id;

		switch (data.unit_name) {
			case 'enemy1':
				unit = Crafty.e("2D, Canvas, Image, Collision, HTML, Gravity, enemy1")
				.attr({
					w: 72,
					h: 34,
					x: data.x,
					y: data.y,
					life: units[data.unit_name].life,
					unit_id: unit_id,
					down: false,
					index: 0
				})
				.image('/images/bomb1.png')
				.css('z-index', 100)
				.collision()
				.onHit('projectile', function(data) {
					socket.emit('unit_hit', {id: unit_id, damage: data[0].obj.damage, projectile_id: data[0].obj.projectile_id});
				})
				.bind('EnterFrame', function() {
					if (this.down) {
						this.x -= 5;
						if (this.y > 700) {
							spawned_units.splice(this.index, 1);
							this.destroy();
						}
					}
				});
				break;
			case 'enemy2':
				unit = Crafty.e("2D, Canvas, Image, Collision, HTML, Gravity, enemy2")
				.attr({
					w: 73,
					h: 29,
					x: data.x,
					y: data.y,
					life: units[data.unit_name].life,
					unit_id: unit_id,
					down: false,
					index: 0
				})
				.image('/images/bomb2.png')
				.css('z-index', 100)
				.collision()
				.onHit('projectile', function(data) {
					socket.emit('unit_hit', {id: unit_id, damage: data[0].obj.damage, projectile_id: data[0].obj.projectile_id});
				})
				.bind('EnterFrame', function() {
					if (this.down) {
						this.x -= 5;
						if (this.y > 700) {
							spawned_units.splice(this.index, 1);
							this.destroy();
						}
					}
				});
				break;
			case 'enemy3':
				unit = Crafty.e("2D, Canvas, Image, Collision, HTML, Gravity, enemy3")
				.attr({
					w: 144,
					h: 70,
					x: data.x,
					y: data.y,
					life: units[data.unit_name].life,
					unit_id: unit_id,
					down: false,
					index: 0
				})
				.image('/images/bomb3.png')
				.css('z-index', 100)
				.collision()
				.onHit('projectile', function(data) {
					socket.emit('unit_hit', {id: unit_id, damage: data[0].obj.damage, projectile_id: data[0].obj.projectile_id});
				})
				.bind('EnterFrame', function() {
					if (this.down) {
						this.x -= 5;
						if (this.y > 700) {
							spawned_units.splice(this.index, 1);
							this.destroy();
						}
					}
				});
				break;
			case 'enemy4':
				unit = Crafty.e("2D, Canvas, Image, Collision, HTML, Gravity, enemy4")
				.attr({
					w: 50,
					h: 50,
					x: data.x,
					y: data.y,
					life: units[data.unit_name].life,
					unit_id: unit_id,
					down: false,
					index: 0
				})
				.image('/images/bomb4.png')
				.css('z-index', 100)
				.collision()
				.onHit('projectile', function(data) {
					socket.emit('unit_hit', {id: unit_id, damage: data[0].obj.damage, projectile_id: data[0].obj.projectile_id});
				})
				.bind('EnterFrame', function() {
					if (this.down) {
						this.x -= 5;
						if (this.y > 700) {
							spawned_units.splice(this.index, 1);
							this.destroy();
						}
					}
				});
				break;
			case 'enemy5':
				unit = Crafty.e("2D, Canvas, Image, Collision, HTML, Gravity, enemy5")
				.attr({
					w: 50,
					h: 50,
					x: data.x,
					y: data.y,
					life: units[data.unit_name].life,
					unit_id: unit_id,
					down: false,
					index: 0
				})
				.image('/images/bomb5.png')
				.css('z-index', 100)
				.collision()
				.onHit('projectile', function(data) {
					socket.emit('unit_hit', {id: unit_id, damage: data[0].obj.damage, projectile_id: data[0].obj.projectile_id});
				})
				.bind('EnterFrame', function() {
					if (this.down) {
						this.x -= 5;
						if (this.y > 700) {
							spawned_units.splice(this.index, 1);
							this.destroy();
						}
					}
				});
				break;
		}

		spawned_units.push({id: data.id, unit_name: data.unit_name, unit: unit});
	});

	socket.on('update_unit_pos', function(data) {
		for (var i in spawned_units) {
			if (spawned_units[i].id == data.id) {
				spawned_units[i].unit.x = data.x;
				spawned_units[i].unit.y = data.y;
			}
		}
	});

	socket.on('unit_down', function(data) {
		for (var i in spawned_units) {
			if (spawned_units[i].id == data.id) {
				if (data.shooted) {
					spawned_units[i].unit.down = true;
					spawned_units[i].unit.index = i;
					spawned_units[i].unit.gravity();
				} else {
					spawned_units[i].unit.destroy();
					spawned_units.splice(i, 1);
				}
			}
		}
	});

	socket.on('sink_update', function(data) {
		$('#sink span').text(data.sink)
		$('#growth span').text(data.growth)
	});
}