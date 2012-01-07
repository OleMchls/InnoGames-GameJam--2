var sink = 25000;
var growth = 2000;

exports.events = function (socket) {

	function updateSink() {
		var data = {
			sink: sink,
			growth: growth
		}
		socket.emit('sink_update', data)
		socket.broadcast.emit('sink_update', data)
	}

	socket.on('send_enemy', function (data) {
		socket.broadcast.emit('create_enemy', data);
	});
	socket.on('spend_sink', function (data) {
		sink -= parseInt(data.value);
		updateSink();
	});

	setInterval(function(){
		sink += growth;
		updateSink();
	}, 5000);

	updateSink();

}
