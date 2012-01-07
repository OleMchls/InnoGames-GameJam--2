exports.ai = function() {

	var viewport_w = 1400;
	var viewport_h = 600;

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

	this.enemy1 = function(data) {
		data.x -= 2.7;
		if (data.x < 0 || data.y < 0 || data.x > viewport_w || data.y > viewport_h) {
			if (hk.role == 'defender' || data.x < 0) {
//				socket.emit('end_reached', {
//					unit: 'enemy1',
//					refund: units['enemy1'].price * 2
//				})
			}
			this.destroy();
		}

		return data;
	}

	this.enemy2 = function(data) {
		data.x -= 3.5;
		if (data.x < 0 || data.y < 0 || data.x > viewport_w || data.y > viewport_h) {
			if (hk.role == 'defender' || data.x < 0) {
//				socket.emit('end_reached', {
//					unit: 'enemy2',
//					refund: units['enemy2'].price * 2
//				})
			}
			this.destroy();
		}

		return data;
	}

	this.enemy3 = function(data) {
		data.x -= 1.7;
		if (data.player.x < data.x) {
			if (data.player.y > data.y)
				data.y += 0.7;
			else
				data.y -= 0.7;
		}
		if (data.x < 0 || data.y < 0 || data.x > viewport_w || data.y > viewport_h) {
			if (hk.role == 'defender' || data.x < 0) {
//				socket.emit('end_reached', {
//					unit: 'enemy3',
//					refund: units['enemy3'].price * 2
//				})
			}
			this.destroy();
		}

		return data;
	}

	this.enemy4 = function(data) {
		data.x -= 1;
		data.y -= rand(0,3)
		data.y += rand(0,3)
		if (data.x < 0 || data.y < 0 || data.x > viewport_w || data.y > viewport_h) {
			if (hk.role == 'defender' || data.x < 0) {
//				socket.emit('end_reached', {
//					unit: 'enemy4',
//					refund: units['enemy4'].price * 2
//				})
			}
			this.destroy();
		}

		return data;
	}

	this.enemy5 = function(data) {
		data.x -= 3;
		data.y -= rand(0,5)
		data.y += rand(0,5)
		if (data.x < 0 || data.y < 0 || data.x > viewport_w || data.y > viewport_h) {
			if (hk.role == 'defender' || data.x < 0) {
//				socket.emit('end_reached', {
//					unit: 'enemy5',
//					refund: units['enemy5'].price * 2
//				})
			}
			this.destroy();
		}

		return data;
	}
}