// Config
var port = 8080;
var interval = 0.5;
var resolution = '800x600';

// Init libs
var express = require('express');
var app = express();
app.use(express.static(__dirname));
var http = require('http');
var server = http.createServer(app);
server.listen(port);
var io = require('socket.io').listen(server);

// routing
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

var clients = [];
io.sockets.on('connection', function (socket) {
    console.log('Client connected');
    clients.push(socket);
});


// Camelot init
var Camelot = require('camelot');
var camelot = new Camelot( {
    'rotate' : '180',
    'flip' : 'v'
});

function broadcastFrame(image) {
    console.log('broadcasting');
    for(var i in clients) {
	clients[i].emit('frame', {frame: image});
    }
}

console.time('grab');
camelot.on('frame', function (image) {
    console.timeEnd('grab');
    broadcastFrame(image);
    console.time('grab');
});

camelot.on('error', function (err) {
    console.log(err);
});

camelot.grab( {
    'title' : 'WebCam.io',
    'font' : 'Arial:24',
    'frequency' : interval,
    'resolution': resolution,
});
