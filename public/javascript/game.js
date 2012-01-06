hk.Game = function() {

	var that = this;
	var bg_pos = 0;

	/**
	 * Initializes the game.
	 */
	this.init = function() {
		Crafty.init(1000, 600);
		Crafty.canvas.init();

		that.scrollBackground();

		Crafty.e("2D, DOM, Image, player")
			.attr({w: 15, h: 15, x: 43, y: 43, moving_key: 0})
			.image('/images/ship.png')
			.css('z-index', 100)
			.bind("KeyDown", function(e) {
				this.moving_key = e.keyCode;
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
				}
			});
	}

	this.scrollBackground = function() {
		bg_pos -= 2;
		$('#cr-stage').css('background-position', bg_pos);

		setTimeout(that.scrollBackground, 30);
	}
}