const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const mm = require('musicmetadata');
const SpotifyWebApi = require('spotify-web-api-node');
const async = require('async');
const ejs = require('ejs');
const app = express();
var md5 = require('MD5');
var io = require('socket.io');
var internetradio = require('node-internet-radio');



// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId : '1b25b20eb6644b7f84861a486146b68a',
    clientSecret : '159c9817efd544059cb01b2cdc5a3a19',
    redirectUri : 'http://localhost/callback'
});

fs.writeFile('/home/hackathon/playlist.m3u', '/home/hackathon/www/uploads/Audioslave - Be Yourself.mp3' + "\n", function(){
});

io = io.listen(app.listen(25568));

var musicUpload = [];
var spotifyMeta ='';
var simpleMeta = '';

var checkExist = function(test)
{
    for(var i=0;i<musicUpload.length;i++)
    {
        if(musicUpload[i].track == test)
        {
            return false;
        }
    }
    return true;
};

// default options
app.use(fileUpload());
app.use('/assets', express.static('include'));
app.set('view engine', 'ejs');


// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
    var html = ''
    for(var i = 0 ; i<musicUpload.length;i++)
    {
        console.log(musicUpload[i]);
        html+="<div class='item' name='"+musicUpload[i].preview+"'>"+
            "<div class='vignette'>"+
            "<img src='"+musicUpload[i].cover+"' alt='"+musicUpload[i].track+"'/>"+
            "<div class='info'>"+
            "<img src='assets/images/play_button_preview.png' alt='preview'/>"+
            "<div>"+
            "<div>"+musicUpload[i].album+"</div>"+
            "<div>"+musicUpload[i].artist+"</div>"+
            "<div>"+musicUpload[i].track+"</div>"+
            "</div>"+
            "</div>"+
            "</div></div>";
    }

    console.log(html);
    res.render('index', { vignettes : html});
});

app.get('/stream', function(req, res){
    res.sendFile(__dirname + '/test2.html');
});

app.get('/musics',function (req,res) {
    var html ='';
    for(var i=0; i<musicUpload.length;i++)
    {
        html+='<img src="'+musicUpload[i].cover+'" data="'+musicUpload[i].path+'" alt="'+musicUpload[i].track+'"><a href="'+musicUpload[i].preview+'">Preview</a><p>'+musicUpload[i].track+'</p>';
    }
    return res.status(200).send(html);
});


app.post('/', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded');

    var musicUploaded = req.files.musique;
    var nomFichier = musicUploaded.name.split(".");
    var uploadPath = __dirname + '/uploads/'+musicUploaded.name;

    if(nomFichier[nomFichier.length-1]=="mp3")
    {
        // Use the mv() method to place the file somewhere on your server
        musicUploaded.mv(uploadPath, function(err) {
            if (err) {
            return res.status(500).send(err);
            }else
            {
                var calls = [];
                calls.push(function(callback){

                    //On doit passer en synchrone
                    var parser = mm(fs.createReadStream(uploadPath), function (err, metadata) {
                        if (err) throw err;

                        simpleMeta = metadata;


                        spotifyApi.searchTracks('track:'+metadata.title+' artist:'+metadata.artist)
                            .then(function(data) {
                                spotifyMeta = data.body;
                                console.log(data.body.tracks.items[0].album.id);
                                if(data.body.tracks.items[0]!==undefined) {
                                    spotifyApi.getAlbums([data.body.tracks.items[0].album.id]).then(function (data) {
                                        console.log(data.body.albums[0].images[0].url);
                                        spotifyMeta.cover = data.body.albums[0].images[0].url;
                                        callback();
                                    }, function (err) {
                                        console.log('Something went wrong!', err);
                                        callback();
                                    });
                                }else {
                                    callback();
                                }
                            }, function(err) {
                                console.log('Something went wrong!', err);
                                callback();
                            });
                    });
                });
                async.parallel(calls,function (err,result) {
                    if(err)throw err;
                    if(spotifyMeta.tracks.items[0] !== undefined) {
                        var temp = spotifyMeta.tracks.items[0];
                        if(checkExist(temp.name))
                        {
                            var musique  = {
                                artist : temp.artists[0].name,
                                album : temp.album.name,
                                track : temp.name,
                                preview : temp.preview_url,
                                cover : spotifyMeta.cover,
                                path: uploadPath
                            };
                            musicUpload.push(musique);
                            io.sockets.emit('newMusic',musique);
                            console.log('emit');

                            var sys = require('sys')
                            var exec = require('child_process').exec;
                            var pid;
                            function puts2(error, stdout, stderr) { pid = stdout; console.log(pid); exec("kill -1 " + pid, puts3); console.log("kill -1 " + pid + "terminé"); }
                            function puts3(error, stdout, stderr) { console.log(stdout); }
                            //exec("find /home/hackathon/www/uploads/ -name *.mp3 > /home/hackathon/playlist.m3u", puts3);

                            var callbacks = [];

                            fs.writeFileSync('/home/hackathon/playlist.m3u', '');

                            callbacks.push(function(callback) {
                                musicUpload.forEach(function (musicData) {
                                    fs.appendFile('/home/hackathon/playlist.m3u', musicData.path + "\n");
                                });
                                callback();
                            });

                            async.parallel(callbacks, function (err,result) {
                                if(err) throw err;
                                exec("ps aux | grep ezstream | grep -v 'grep' | grep -o '[0-9]*' | head -n1", puts2);
                            });
                        }
                        res.redirect('/');
                    }else{
                        return res.status(200).send('<h1>Metadata incorrect</h1>')
                    }
                });

            }
    });
    }else{
        return res.status(500).send('<h1>Format Incorrect </h1>');
    }
});

var oldVignette ='';
var oldPath = '';
var users = {};
var messages = [];
var history = 20;
var nbVote = 0;

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
        me.id = md5(user.username);
        socket.emit('loged');
        users[me.id] = me;
        io.sockets.emit('newuser' , me);
    });

    //je me deconnecte
    socket.on('disconnect', function () {
        if (!me) {return false};
        delete users[me.id];
        io.sockets.emit('discuser' , me);
    });



    //reception vote
    socket.on('votage', function () {
        console.log(nbVote);
        nbVote++;
        console.log(nbVote);
        io.sockets.emit('vote' , nbVote);
    });

});
var actualiserMusiqueCourante = function(nom)
{
    for(var i=0; i<musicUpload.length;i++ )
    {
        if(musicUpload[i].path.replace(__dirname,'') === nom)
            return musicUpload[i].path;
    }

    return null;
}

var testStream = "http://voxystudio.com:25567/stream";
setInterval(function() {
    internetradio.getStationInfo(testStream, function(error, station) {
    var path = actualiserMusiqueCourante(station.title);
    if(path!==oldPath) {

        io.sockets.emit("newPlayingSong", path);
    }
    });
}, 5000);
