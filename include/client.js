(function () {

	var socket = io.connect("http://voxystudio.com:25568");
	var msgtpl = $('#msgtpl').html();
	$('#msgtpl').remove();

	$('#loginform').submit(function (event) {
		event.preventDefault();
		socket.emit('login', {
			username : $('#username').val(),
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
		$('#chat').animate({scrollTop : $('#chat')[0].scrollHeight} , 50);
	});

	//gestion des connection
	socket.on('newuser', function (user) {
		$("#users").append('<p>' + user.username + '</p>');
	});

	//gestion des deconnections
	socket.on('discuser', function (user) {
		$('#' + user.id).remove();
	})

    //gestion des deconnections
    socket.on('newMusic', function (user) {
    	console.log(user);

        $('.owl-carousel')
            .owlCarousel('add', '<div class="vignette"><img src="'+user.cover+'" alt="'+user.track+'"><a href="'+user.preview+'">Preview</a><p>'+user.track+'</p></div>')
            .owlCarousel('update');
    })

})();