hk.notification = function(message, time) {
	var $message = $('<p>'+message+'</p>').addClass('message');
	var $wrapper = $('#notifications-wrapper')

	$wrapper.append($message);
	soundManager.getSoundById('bell').play();
	$message.effect("puff", {}, time || 1000, function() {
		$message.remove();
	})

}