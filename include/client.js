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
	});

    //gestion des deconnections
    socket.on('newMusic', function (user) {
    	console.log(user);

		var item = $("<div>").addClass("item").attr("name",user.preview).append(
			$("<div>").addClass("vignette").append(
				$("<img>").attr("src", user.cover).attr("alt", user.track)
			).append(
				$("<div>").addClass("info").append(
					$("<div>").append(
						$("<div>").text(user.album)
					).append(
						$("<div>").text(user.artist)
					).append(
						$("<div>").text(user.track)
					)
				)
			)
		);

		$(item).mouseenter(function () {
			$(item).find(".info").stop().fadeIn(200);
			$(item).find(".info").click(function () {
				$("#frame_player").attr("src",$(item).attr("name"));
				$("#frame_player").fadeIn();
			});
		});
		$(item).mouseleave(function () {
			$(item).find(".info").stop().fadeOut(200);
		});
        $('.owl-carousel')
            .owlCarousel('add', item)
            .owlCarousel('update')
    });

})();