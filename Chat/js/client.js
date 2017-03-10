(function () {

	var socket = io.connect("http://localhost:3003");
	var msgtpl = $('#msgtpl').html();
	$('#msgtpl').remove();

	$('#loginform').submit(function (event) {
		event.preventDefault();
		socket.emit('login', {
			username : $('#username').val(),
			mail : $('#mail').val()
		});
	});

	socket.on('loged' , function () {
		$("#login").fadeOut();
	})

	//envois de message 
	$('#form').submit(function (event) {
		event.preventDefault();
		socket.emit('newmsg', {message : $('#message').val()});
		$('#message').val('');
		$('#message').focus();
	})

	socket.on('newmsg', function (message) {
		$('#messages').append('<div class="message">'+ Mustache.render(msgtpl,message) + '</div>');
		$('#messages').animate({scrollTop : $('#messages').prop('scrollHeight')} , 500);
	});

	//gestion des connection
	socket.on('newuser', function (user) {
		$("#users").append('<img src="' + user.avatar + '" id="' + user.id + '">');
	})

	//gestion des deconnections
	socket.on('discuser', function (user) {
		$('#' + user.id).remove();
	})

})();