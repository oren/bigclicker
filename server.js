"use strict"

var http = require('http');
var fs = require('fs');
var path = require('path');

var app = function (req, res) {
  var reader = null;

  if (req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    reader = fs.createReadStream('index.html');
    reader.pipe(res);

    reader.on('error', function(err) {
      console.log('error: ', err);
      res.end();
    });
    reader.on('end', function() {
      res.end();
    });
  } else {
    if (req.url=== '/anim.gif') {
      res.writeHead(200, {'Content-Type': 'text/html'});
      reader = fs.createReadStream(__dirname + path.sep + 'anim.gif');
      reader.pipe(res);

      reader.on('error', function(err) {
        console.log('error: ', err);
        res.end();
      });
      reader.on('end', function() {
        res.end();
      });
    }
  }
}

var server = http.createServer(app);
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
    socket.on('send', function(data) {
        socket.broadcast.emit('receive', data);
    });
});

server.listen(3001);

console.log('Server running at http://127.0.0.1:3001');
