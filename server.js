ar icecast = require("icecast"), // I'll talk about this module later
    lame = require("lame");

var encoder = lame.Encoder({channels: 2, bitDepth: 16, sampleRate: 44100});
encoder.on("data", function(data) {
    sendData(data);
});
var decoder = lame.Decoder();
decoder.on('format', function(format) {
    decoder.pipe(encoder);
});

var url = 'http://voxystudio.com:25567'
icecast.get(url, function(res) {
    res.on('data', function(data) {
        decoder.write(data);
    });
}

var clients = []; // consider that clients are pushed to this array when they connect

function sendData(data){
    clients.forEach(function(client) {
        client.write(data);
    });
}