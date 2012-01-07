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
			that.spawnUnit(that.selectedUnit, x, y);
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

	this.spawnUnit = function(unit_name, x, y) {
//		var unit;
//		var currentSink = parseInt($('#sink .sink').text());
//		if (currentSink < units[unit_name].price) {
//			return
//		}

		socket.emit('spawn_unit', {
			unit_name: unit_name,
			x: x,
			y: y
		});
	}

	socket.on('create_unit', function(data) {
		var unit = null;
		switch (data.unit_name) {
			case 'enemy1':
				unit = Crafty.e("2D, Canvas, Image, Collision, HTML, enemy1")
				.attr({
					w: 72,
					h: 34,
					x: data.x,
					y: data.y,
					life: units[data.unit_name].life
				})
				.image('/images/bomb1.png')
				.css('z-index', 100)
				.collision()
				.onHit('projectile', function(data) {
					this.life -= data[0].obj.damage;
					if (this.life < 1)
						this.destroy();
				});
				break;
			case 'enemy2':
				unit = Crafty.e("2D, Canvas, Image, Collision, HTML, enemy2")
				.attr({
					w: 73,
					h: 29,
					x: data.x,
					y: data.y,
					life: units[data.unit_name].life
				})
				.image('/images/bomb2.png')
				.css('z-index', 100)
				break;
			case 'enemy3':
				unit = Crafty.e("2D, Canvas, Image, Collision, HTML, enemy3")
				.attr({
					w: 144,
					h: 70,
					x: data.x,
					y: data.y,
					life: units[data.unit_name].life
				})
				.image('/images/bomb3.png')
				.css('z-index', 100)
				.collision()
				.onHit('projectile', function(data) {
					this.life -= data[0].obj.damage;
					if (this.life < 1)
						this.destroy();
					data[0].obj.destroy();
				});
				break;
			case 'enemy4':
				unit = Crafty.e("2D, Canvas, Image, Collision, HTML, enemy4")
				.attr({
					w: 50,
					h: 50,
					x: data.x,
					y: data.y,
					life: units[data.unit_name].life
				})
				.image('/images/bomb4.png')
				.css('z-index', 100)
				.collision()
				.onHit('projectile', function(data) {
					this.life -= data[0].obj.damage;
					if (this.life < 1)
						this.destroy();
					data[0].obj.destroy();
				});
				break;
			case 'enemy5':
				unit = Crafty.e("2D, Canvas, Image, Collision, HTML, enemy5")
				.attr({
					w: 50,
					h: 50,
					x: data.x,
					y: data.y,
					life: units[data.unit_name].life
				})
				.image('/images/bomb5.png')
				.css('z-index', 100)
				.collision()
				.onHit('projectile', function(data) {
					this.life -= data[0].obj.damage;
					if (this.life < 1)
						this.destroy();
					data[0].obj.destroy();
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

	socket.on('sink_update', function(data) {
		$('#sink .sink').text(data.sink)
		$('#sink .growth').text(data.growth)
	});
}