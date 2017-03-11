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

    	var el = $("<div>").toggleClass("vignette");
    	var img = $("<img>").attr("src", user.cover).attr("alt", user.track);
    	var a = $("a").attr("href", user.preview);
    	var p = $("p").append(user.track);

		el.append(img).append(a).append("Preview").append(p);
        $('.owl-carousel')
            .owlCarousel('add', el)
            .owlCarousel('update')

    })

})();