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
		attr({
			w: Crafty.viewport.width,
			h: Crafty.viewport.height
			}).
		image("/images/back_kitchen.jpg", "repeat");
	}
}