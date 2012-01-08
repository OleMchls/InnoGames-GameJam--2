hk.notification = function(message, time) {
	var $message = $('<p>'+message+'</p>').addClass('message');
	var $wrapper = $('#notifications-wrapper')

	$wrapper.append($message);
	$message.effect("puff", {}, time || 1000, function() {
		$message.remove();
	})

}