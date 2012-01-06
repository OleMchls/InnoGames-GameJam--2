hk.Game = function() {

	var that = this;

	/**
	 * Initializes the game.
	 */
	this.init = function() {
		Crafty.init(1000, 600);
		Crafty.canvas.init();

		// background
		var bg = Crafty.e("2D, DOM, Image").
			attr({w: Crafty.viewport.width, h: Crafty.viewport.height}).
			image("/images/back_kitchen.jpg", "repeat").
			bind("EnterFrame", function() {
				//
			});

		var player = Crafty.e("2D, Canvas, Animate, Collision, Color, HTML, player")
			.attr({w: 15, h: 15, x: 43, y: Crafty.viewport.height - 20 - 15, last_x: 0, last_y: 0, move: {left: false, right: false, up: false, down: false}})
			.color('#FF0000')
			.css('z-index', 100)
			.bind("KeyDown", function(e) {
				//
			})
			.bind("KeyUp", function(e) {
				//
			});

		var defender = new hk.defender();
		defender.init();
	}
}