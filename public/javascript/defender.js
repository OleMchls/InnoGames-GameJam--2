hk.defender = function() {

	var that = this;
	var selectedUnit = null;

	this.init = function() {
		// dropzone
		var dropzone = Crafty.e("2D, DOM, Image").
			attr({
				w: 160,
				h: Crafty.viewport.height,
				x: Crafty.viewport.width - 160,
				y: 0
			}).
			image("/images/dropzone.png")

	}

	this.selectUnit = function(unit_name) {
		selectedUnit = unit_name;
	}

	this.spawUnit = function() {

	}

}

$('body').bind('crafty_loaded', function(){
	var defender = new hk.defender();
	defender.init();
	$('#defender-controlls .enemy').bind('click.defender', function(event){
		defender.selectUnit(event.currentTarget.id);
	})
})
