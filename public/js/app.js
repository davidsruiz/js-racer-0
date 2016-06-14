// app.js
function p(m) {console.log(m)}
function ce(estr) {return document.createElement(estr)}
function byid(idstr) {return document.getElementById(idstr)}

var game = {

  // game variables
  n: 0,
  index: -1,
  isSetup: false,
  isOver: false,
  positions: [],
  winners: [],
  distance: 320,

  // game constants
  COLOR_CLASSES: ["red", "blue", "green", "purple", "yellow", "pink", "cyan", "gray"], // default
  KEY_BINDINGS: [32], // keycodes 'space'
  STEP: 32,

  // game functions

  setup: function(n) {
    // number of steps
    // this.steps(10);

    // number of players
    if(!n || n < 2) n = 1;

    // setup players
    for(var i = 0; i < n; i++) {
      this.addPlayer(i);
    }

    this.isSetup = true;

    this.resetBoard();
  },
  start: function() {
    if(!game.isSetup) game.setup();

    document.addEventListener("keydown", game.update);
  },
  sendState: function() {
    socket.emit('update player', this.index);
  },
  receive: function(index) {
    game.updatePlayer(index);
  },
  update: function(event) {
    var triggered = game.KEY_BINDINGS.indexOf(event.keyCode) != -1;
    if(triggered) { game.updatePlayer(game.index); game.sendState(); }
  },
  resetBoard: function() {
    console.log("do something");
  },
  updatePlayer(i) {
    if(!game.isOver) {
      game.updatePosition(i);
      game.updateDisplayFor(i);
      game.checkForWinner();
    }
  },
  updatePosition: function(i) {
    this.updatePlayerPositionBy(i, this.STEP);
  },
  updatePlayerPositionBy: function(i, n) {
    if (i != -1) {
      this.positions[i] += n;
      if (this.positions[i] > this.distance) this.positions[i] = this.distance;
    }
  },
  updateDisplay: function() {
    for(var i = 0; i < this.n; i++) {
      this.updateDisplayFor(i);
    }
  },
  updateDisplayFor: function(i) {
    lane = byid("board").children[i];
    lane.children[0].style.width = this.positions[i] + "px";
  },
  checkForWinner: function() {
    for(var i = 0; i < this.n; i++) {
      if (this.positions[i] == this.distance) {
        this.winners.push(i);
        this.isOver = true;
      }
    }
    if (this.isOver) alert("Winner(s): " + this.winners.map(function(e){return e+1}).join(", "));
  },

  steps: function(n) { this.STEP = this.distance / n },
  addPlayer: function() {
    game.positions.push(0); // positions
    game.createLane(game.n++);
  },
  createLane: function(i) {
    var lane = ce("div");
    lane.className = "lane " + this.COLOR_CLASSES[i];

    var progress_box = ce("div");
    progress_box.className = "progress_box";
    var player_box = ce("div");
    player_box.className = "player_box";
    var ghost_box = ce("div");
    ghost_box.className = "ghost_box";

    lane.appendChild(progress_box);
    lane.appendChild(player_box);
    lane.appendChild(ghost_box);

    byid("board").appendChild(lane);
    byid("board").style.width = (this.distance + 32) + "px";
  }
}

// window.onload = function() {game.setup(3); game.start();}
