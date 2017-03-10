var http = require('http');
var md5 = require('MD5');

httpServer = http.createServer(function (req,res) {
	console.log("Bonjour");
});

httpServer.listen(3003);

var io = require('socket.io').listen(httpServer);
var users = {};
var messages = [];
var history = 20;

io.sockets.on('connection', function (socket) {

	var me = false;

	console.log("new user");

	for (var i in users) {
		socket.emit('newuser', users[i]);
	};
	for (var i in messages) {
		socket.emit('newmsg', messages[i]);
	};

	//reception message
	socket.on('newmsg', function (message) {
		message.user = me;
		date = new Date();
		message.h = date.getHours();
		message.m = date.getMinutes();
		messages.push(message);
		if (messages.length > history) {
			messages.shift();
		};
		io.sockets.emit('newmsg', message);
	});

	//je me connecte 
	socket.on('login', function (user) {
		me = user;
		me.id = user.mail.replace('@','-').replace(".","-");
		me.avatar = 'https://gravatar.com/avatar/' + md5(user.mail) + '?s=50';
		socket.emit('loged');
		users[me.id] = me;
		io.sockets.emit('newuser' , me);
	});

	//je me deconnecte
	socket.on('disconnect', function () {
		if (!me) {return false};
		delete users[me.id];
		io.sockets.emit('discuser' , me);
	})

});