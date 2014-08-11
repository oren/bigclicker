"use strict"

var http = require('http');
var fs = require('fs');
var path = require('path');

var ip = process.argv[2] || 'localhost';

var handler = function (req, res) {
  var reader = null;

  if (req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});

    fs.readFile('index.html',function (err, data) {
      if (err) throw err;
      data = data.toString().replace('{ip}', ip);
      res.write(data);
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

var server = http.createServer(handler);
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
    socket.on('send', function(data) {
        socket.broadcast.emit('receive', data);
    });
});

server.listen(3001);

console.log('Server running at http://' + ip + ':3001');
