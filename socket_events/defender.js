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

	socket.on('build_unit', function (data) {
		sink -= parseInt(data.unit.price);
		growth += parseInt(data.unit.growth);
		updateSink();
	});

	socket.on('end_reached', function (data) {
		sink += parseInt(data.refund);
		updateSink();
	});

	setInterval(function(){
		sink += growth;
		updateSink();
	}, 5000);

	updateSink();

}
