const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const mm = require('musicmetadata');
const SpotifyWebApi = require('spotify-web-api-node');
const async = require('async');
const ejs = require('ejs');
const app = express();

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId : '1b25b20eb6644b7f84861a486146b68a',
    clientSecret : '159c9817efd544059cb01b2cdc5a3a19',
    redirectUri : 'http://localhost/callback'
});

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
}

// default options
app.use(fileUpload());
app.use('/assets', express.static('include'));
app.set('view engine', 'ejs');


// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
    var html = ''
    for(var i = 0 ; i<musicUpload.length;i++)
    {

        html+="<div class='item'><div class='vignette'><img src='"+musicUpload[i].cover+"' alt='"+musicUpload[i].track+"'/></div></div>";
    }
    console.log(html);
    res.render('index', { vignettes : html});
});

app.get('/musics',function (req,res) {
    var html ='';
    for(var i=0; i<musicUpload.length;i++)
    {
        html+='<img src="'+musicUpload[i].cover+'" alt="'+musicUpload[i].track+'"><a href="'+musicUpload[i].preview+'">Preview</a><p>'+musicUpload[i].track+'</p>';
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
                                artist : temp.artists.name,
                                album : temp.album.name,
                                track : temp.name,
                                preview : temp.preview_url,
                                cover : spotifyMeta.cover
                            };
                            musicUpload.push(musique);
                        }
                        res.redirect('/');
                        return res.status(200).send(spotifyMeta.tracks.items[0]);
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

app.listen(2000);
