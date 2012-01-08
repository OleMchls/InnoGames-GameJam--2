soundManager.onready(function() {

	soundManager.createSound({
		id: 'explosion_bomb', // required
		url: '/audio/explosion_bomb.mp3', // required
		// optional sound parameters here, see Sound Properties for full list
		volume: 40,
		autoPlay: false
	});
	soundManager.createSound({
		id: 'hit', // required
		url: '/audio/hit.mp3', // required
		// optional sound parameters here, see Sound Properties for full list
		volume: 40,
		autoPlay: false
	});
	soundManager.createSound({
		id: 'ship_die', // required
		url: '/audio/ship_die.mp3', // required
		// optional sound parameters here, see Sound Properties for full list
		volume: 40,
		autoPlay: false
	});
	soundManager.createSound({
		id: 'shoot', // required
		url: '/audio/shoot.mp3', // required
		// optional sound parameters here, see Sound Properties for full list
		volume: 40,
		autoPlay: false
	});
	soundManager.createSound({
		id: 'bell', // required
		url: '/audio/bell.mp3', // required
		// optional sound parameters here, see Sound Properties for full list
		volume: 60,
		autoPlay: false
	});
	soundManager.createSound({
		id: 'print', // required
		url: '/audio/print.mp3', // required
		// optional sound parameters here, see Sound Properties for full list
		volume: 40,
		autoPlay: false
	});

	soundManager.createSound({
		id: 'background', // required
		url: '/audio/background.mp3', // required
		// optional sound parameters here, see Sound Properties for full list
		volume: 80,
		autoPlay: true,
		loops: 100000000
	});

});