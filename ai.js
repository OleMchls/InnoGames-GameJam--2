exports.ai = function() {

	this.enemy1 = function() {
		this.x -= 2.7;
		if (this.x < 0 || this.y < 0 || this.x > Crafty.viewport.width || this.y > Crafty.viewport.height) {
			if (hk.role == 'defender' || this.x < 0) {
				socket.emit('end_reached', {
					unit: unit_name,
					refund: units[unit_name].price * 2
				})
			}
			this.destroy();
		}
	}

	this.enemy2 = function() {
		this.x -= 3.5;
		if (this.x < 0 || this.y < 0 || this.x > Crafty.viewport.width || this.y > Crafty.viewport.height) {
			if (hk.role == 'defender' || this.x < 0) {
				socket.emit('end_reached', {
					unit: unit_name,
					refund: units[unit_name].price * 2
				})
			}
			this.destroy();
		}
	}

	this.enemy3 = function() {
		this.x -= 1.7;
		if (hk.player.x < this.x) {
			if (hk.player.y > this.y)
				this.y += 0.7;
			else
				this.y -= 0.7;
		}
		if (this.x < 0 || this.y < 0 || this.x > Crafty.viewport.width || this.y > Crafty.viewport.height) {
			if (hk.role == 'defender' || this.x < 0) {
				socket.emit('end_reached', {
					unit: unit_name,
					refund: units[unit_name].price * 2
				})
			}
			this.destroy();
		}
	}

	this.enemy4 = function() {
		this.x -= 1;
		this.y -= rand(0,3)
		this.y += rand(0,3)
		if (this.x < 0 || this.y < 0 || this.x > Crafty.viewport.width || this.y > Crafty.viewport.height) {
			if (hk.role == 'defender' || this.x < 0) {
				socket.emit('end_reached', {
					unit: unit_name,
					refund: units[unit_name].price * 2
				})
			}
			this.destroy();
		}
	}

	this.enemy5 = function() {
		this.x -= 3;
		this.y -= rand(0,5)
		this.y += rand(0,5)
		if (this.x < 0 || this.y < 0 || this.x > Crafty.viewport.width || this.y > Crafty.viewport.height) {
			if (hk.role == 'defender' || this.x < 0) {
				socket.emit('end_reached', {
					unit: unit_name,
					refund: units[unit_name].price * 2
				})
			}
			this.destroy();
		}
	}
}