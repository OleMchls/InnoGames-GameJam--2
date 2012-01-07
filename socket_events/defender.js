var sink = 0;

exports.events = function (socket) {

	function updateSink() {
		socket.emit('sink_update', {
			sink: sink
		})
		socket.broadcast.emit('sink_update', {
			sink: sink
		})
	}

	socket.on('send_enemy', function (data) {
		socket.broadcast.emit('create_enemy', data);
	});
	socket.on('spend_sink', function (data) {
		sink -= parseInt(data.value);
		updateSink();
	});

	setInterval(function(){
		sink += 10;
		updateSink();
	}, 800);

	updateSink();

}
