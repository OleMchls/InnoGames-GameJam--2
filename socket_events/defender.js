var start_sink = 25000;
var start_growth = 2000;
var sink = start_sink;
var growth = start_growth;

exports.events = function (socket) {

	function updateSink() {
		var data = {
			sink: sink,
			growth: growth
		}
		socket.emit('sink_update', data)
		socket.broadcast.emit('sink_update', data)
	}

	socket.on('build_unit', function (data) {
		sink -= parseInt(data.unit.price);
		growth += parseInt(data.unit.growth);
		updateSink();
	});

	socket.on('end_reached', function (data) {
		sink += parseInt(data.refund);
		updateSink();
	});

	socket.on('reset_game', function() {
		sink = start_sink;
		growth = start_growth;
		updateSink();
	})

	setInterval(function(){
		sink += growth;
		updateSink();
	}, 5000);

	updateSink();

}
