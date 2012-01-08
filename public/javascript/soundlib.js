soundManager.onready(function() {

	soundManager.createSound({
		id: 'explosion_bomb', // required
		url: '/audio/explosion_bomb.mp3', // required
		// optional sound parameters here, see Sound Properties for full list
		volume: 100,
		autoPlay: false
	});

	soundManager.createSound({
		id: 'background', // required
		url: '/audio/background.mp3', // required
		// optional sound parameters here, see Sound Properties for full list
		volume: 80,
		autoPlay: true
	});

});