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
		data.x -= 5.4;

		return data;
	}

	this.enemy2 = function(data) {
		data.x -= 7;

		return data;
	}

	this.enemy3 = function(data) {
		data.x -= 3.4;
		if (data.player.x < data.x) {
			if (data.player.y > (data.y - 50))
				data.y += 1.4;
			else
				data.y -= 1.4;
		}

		return data;
	}

	this.enemy4 = function(data) {
		data.x -= 4;
		data.y -= rand(0,3)
		data.y += rand(0,3)

		return data;
	}

	this.enemy5 = function(data) {
		data.x -= 6;
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