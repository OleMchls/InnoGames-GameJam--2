hk.defender = function() {

	var that = this;
	this.selectedUnit = null;
	var unitList = [];

	this.init = function() {
		// dropzone
		var dropzone = Crafty.e("2D, DOM, Image, dropzone").
		attr({
			w: 160,
			h: Crafty.viewport.height,
			x: Crafty.viewport.width - 160,
			y: 0
		}).
		image("/images/dropzone.png")

		$(dropzone._element).bind('click.dropzone', function(event) {
			var x = (Crafty.viewport.width - 160) + event.offsetX;
			var y = event.offsetY;
			that.spawnUnit(that.selectedUnit, x, y);
		})

		$('#defender-controlls .enemy').bind('click.defender', function(event){
			that.selectUnit(event.currentTarget.id);
		})
	}

	this.selectUnit = function(unit_name) {
		that.selectedUnit = unit_name;
		$('#selected-unit img').attr('src', '/images/'+unit_name+'.png')
	}

	this.spawnUnit = function(unit_name, x, y) {
		var unit;
		switch (unit_name) {
			case 'enemy1':
				unit = Crafty.e("2D, Canvas, Image, Collision, HTML, enemy")
				.attr({
					w: 72,
					h: 34,
					x: x,
					y: y
				})
				.image('/images/enemy1.png')
				.css('z-index', 100)
				.bind('EnterFrame', function() {
					this.x -= 1;
				})
				break;
			case 'enemy2':
				unit = Crafty.e("2D, Canvas, Image, Collision, HTML, enemy")
				.attr({
					w: 73,
					h: 29,
					x: x,
					y: y
				})
				.image('/images/enemy2.png')
				.css('z-index', 100)
				.bind('EnterFrame', function() {
					this.x -= 1;
				})
				break;
			case 'enemy3':
				unit = Crafty.e("2D, Canvas, Image, Collision, HTML, enemy")
				.attr({
					w: 144,
					h: 70,
					x: x,
					y: y
				})
				.image('/images/enemy3.png')
				.css('z-index', 100)
				.bind('EnterFrame', function() {
					this.x -= 1;
				})
				break;
			case 'enemy4':
				unit = Crafty.e("2D, Canvas, Image, Collision, HTML, enemy")
				.attr({
					w: 50,
					h: 50,
					x: x,
					y: y
				})
				.image('/images/enemy1.png')
				.css('z-index', 100)
				.bind('EnterFrame', function() {
					this.x -= 1;
				})
				break;
			case 'enemy5':
				unit = Crafty.e("2D, Canvas, Image, Collision, HTML, enemy")
				.attr({
					w: 50,
					h: 50,
					x: x,
					y: y
				})
				.image('/images/enemy1.png')
				.css('z-index', 100)
				.bind('EnterFrame', function() {
					this.x -= 1;
				})
				break;
		}

		unitList.push(unit);
	}

}