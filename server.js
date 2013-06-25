// Config
var port = 8080;
var frequency = 10;

// Init libs
var express = require('express');
var app = express()
app.use(express.static(__dirname));
var http = require('http')
var server = http.createServer(app)
var io = require('socket.io').listen(server);

server.listen(port);

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

camelot.on('frame', function (image) {
    broadcastFrame(image);
});

camelot.on('error', function (err) {
    console.log(err);
});

camelot.grab( {
  'title' : 'Camelot',
  'font' : 'Arial:24',
  'frequency' : frequency
});
