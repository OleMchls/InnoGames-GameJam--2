var game  = {
	roles: {}
};
game.roles.ATTACKER = 'attacker';
game.roles.DEFENDER = 'defender';
game.roles.VISITOR = 'visitor';

exports.events = function (socket) {
	socket.on('connect', function (data) {
		console.log(data);
	});
}