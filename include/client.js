(function () {
	var socket = io.connect("http://voxystudio.com:25568");
	var msgtpl = $('#msgtpl').html();
	var vote = false;
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
		$('#messages').animate({scrollTop : $('#messages')[0].scrollHeight} , 50);
	});

	//vote music suivante 
	$('#voteMusic').submit(function (event) {
		event.preventDefault();
		if (!vote) {
			vote = !vote;
			socket.emit('votage');
		};
		
	});

	socket.on('vote', function (nbVote) {
		$('#votation').text("Nb vote : "+nbVote);
	});

	socket.on('voteOver', function (nbVote) {
		vote = false;
	});

	var nbUser = 0;

	//gestion des connection
	socket.on('newuser', function (user) {
		nbUser++;
		$("#liste_users").append('<div id="user_'+user.id+'">' + user.username + '</div>');
		$("#nb_users").text("Nombre d'utilisateurs : "+nbUser);
	});

	//gestion des deconnections
	socket.on('discuser', function (user) {
		nbUser--;
		$('#user_' + user.id).remove();
		$("#nb_users").text("Nombre d'utilisateurs : "+nbUser);
	});

    //gestion des deconnections
    socket.on('newMusic', function (user) {
    	console.log(user);

		var item = $("<div>").addClass("item").attr("name",user.preview).append(
			$("<div>").addClass("vignette").append(
				$("<img src='"+user.cover+"' data='"+user.path+"' alt='"+user.track+"'>")
			).append(
				$("<div>").addClass("info").append(
					$("<img>").attr("src", "assets/images/play_button_preview.png").attr("alt", "preview").addClass("preview")
				).append(
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
/*
		var nbItems = document.getElementsByClassName("item").length;
		$("#fleche_droite").fadeIn(0);
		$("#fleche_gauche").fadeIn(0);
		if($(window).width() >= 600){
			if($(window).width() >= 100){
				if(nbItems <= 5){
					$("#fleche_droite").fadeOut(0);
					$("#fleche_gauche").fadeOut(0);
				}
			}else{
				if(nbItems <= 3){
					$("#fleche_droite").fadeOut(0);
					$("#fleche_gauche").fadeOut(0);
				}
			}
		}else{
			if(nbItems <= 1){
				$("#fleche_droite").fadeOut(0);
				$("#fleche_gauche").fadeOut(0);
			}
		}*/

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

    socket.on('newPlayingSong', function (data){
    	console.log(data);
        var p = $(".vignette:eq("+data[0]+")").css("border", "solid red 1px");
        if(data[0] != data[1]){
        	for(var i = data[0]; i < data[1]; i++)
            $('.owl-carousel').trigger('next.owl.carousel');
            $(".vignette:eq("+data[1]+")").css("border", "solid white 1px");
		}


    });

})();