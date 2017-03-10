const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const mm = require('musicmetadata');
const SpotifyWebApi = require('spotify-web-api-node');
const async = require('async');
const app = express();

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId : '1b25b20eb6644b7f84861a486146b68a',
    clientSecret : '159c9817efd544059cb01b2cdc5a3a19',
    redirectUri : 'http://localhost/callback'
});

var spotifyMeta ='';
var simpleMeta = '';

// default options
app.use(fileUpload());

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
    var filePath = __dirname + '/public/index.html';
   res.sendFile(filePath);
});


app.post('/upload', function(req, res) {
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
                                console.log(data.body);
                                spotifyMeta = data.body;
                                callback();
                            }, function(err) {
                                console.log('Something went wrong!', err);
                                callback();
                            });
                    });
                });
                async.parallel(calls,function (err,result) {
                    if(err)throw err;
                    if(spotifyMeta.tracks.items[0] !== undefined) {
                        return res.status(200).send(spotifyMeta.tracks.items[0]);
                    }else{
                        return res.status(200).send(simpleMeta);
                    }
                });

            }
    });
    }else{
        return res.status(500).send('<h1>Format Incorrect</h1>');
    }
});

app.listen(2000);
