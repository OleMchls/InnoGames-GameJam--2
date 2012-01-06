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

		$('#defender-controlls .enemy').bind('click.defender', function(event){
			that.selectUnit(event.currentTarget.id);
		})
	}

	this.selectUnit = function(unit_name) {
		selectedUnit = unit_name;
		$('#selected-unit img').attr('src', '/images/'+unit_name+'.png')
	}

	this.spawUnit = function() {

	}

}