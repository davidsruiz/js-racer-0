var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var players = [];

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  socket.emit('index', players.length);
  players.push(socket);
  socket.broadcast.emit('new player');
  console.log(players.length + ' player(s)');

  if(players.length == 2) {
    io.emit('begin');
    console.log('began!');
  }

  socket.on('disconnect', function() {
    console.log('user disconnected');
    var index = players.indexOf(socket);
    console.log('index: ' + index);
    if (index > -1) { console.log('removed socket: ' + players.splice(index, 1).id);}
    console.log(players.length + ' player(s)');
  });

  socket.on('update player', function(index) {
    // console.log('player ' + index + ' moved!');
    socket.broadcast.emit('update player', index);
  });
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});
