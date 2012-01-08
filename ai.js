function rand (min, max) {
	var args = arguments.length;
	if (args === 0) {
		min = 0;
		max = 32768;
	}
	return Math.floor( Math.random() * (max - min + 1) ) + min;
}

var ai = function() {

	this.enemy1 = function(data) {
		data.x -= 2.7;

		return data;
	}

	this.enemy2 = function(data) {
		data.x -= 3.5;

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

		return data;
	}

	this.enemy4 = function(data) {
		data.x -= 1;
		data.y -= rand(0,3)
		data.y += rand(0,3)

		return data;
	}

	this.enemy5 = function(data) {
		data.x -= 3;
		data.y -= rand(0,5)
		data.y += rand(0,5)

		return data;
	}
}

var instance = null;

module.exports.ai = function() {
	if (!instance) {
		instance = new ai();
	}

	return instance;
}