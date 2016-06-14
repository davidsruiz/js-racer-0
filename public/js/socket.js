// var name = sessionStorage.nickname;
// if(name === "undefined") {
//   name = prompt("your name", "Joe Biden");
//   sessionStorage.nickname = name;
// }

var socket = io();

socket.on('index', function(index) {
  game.setup(index + 1);
  game.index = index;
});

socket.on('new player', game.addPlayer);
socket.on('begin', game.start);

socket.on('update player', game.receive);
