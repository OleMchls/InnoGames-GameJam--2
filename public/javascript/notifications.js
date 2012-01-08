hk.notification = function(message) {
	var $message = $('<p>'+message+'</p>').addClass('message');
	var $wrapper = $('#notifications-wrapper')

	$wrapper.append($message);
	$message.effect("puff", {}, 1000, function() {
		$message.remove();
	})

}