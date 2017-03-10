const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const mm = require('musicmetadata');
const app = express();

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
    if(nomFichier[nomFichier.length-1]=="mp3")
    {
        // Use the mv() method to place the file somewhere on your server
        musicUploaded.mv(__dirname + '/uploads/'+musicUploaded.name, function(err) {

            var parser = mm(fs.createReadStream(__dirname + '/uploads/'+musicUploaded.name), function (err, metadata) {
                if (err) throw err;
                return res.status(200).send(metadata);
            });



            if (err) {
            return res.status(500).send(err);
            }
    });
    }else{
        return res.status(500).send('<h1>Format Incorrect</h1>');
    }
});

app.listen(2000);
