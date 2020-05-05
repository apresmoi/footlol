var express = require('express');
var body_parser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
  path: '/'
});

var player = require('./player.js')

app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

let players = {}

const ArePlayersMoving = () => {
  return Object.keys(players).some(key => players[key].direction.dx || players[key].direction.dy)
}

const GetAllPlayers = () => {
  return Object.keys(players).reduce((r, key) => {
    if (io.clients().connected[key]) {
      players[key].updatePosition(players[key].direction)
      r[key] = {
        id: players[key].id,
        direction: players[key].direction,
        position: players[key].position
      }
    }
    return r;
  }, {})
}

io.on('connection', function (socket) {
  console.log(socket.id + ' connected');

  players[socket.id] = new player(socket.id, 0, 0)

  socket.on('disconnect', function (ff) {
    socket.broadcast.emit('player_leave', { id: socket.id });
    console.log(socket.id + ' disconnected');
    delete players[socket.id];
  });

  socket.emit('login_success', {
    id: socket.id,
    position: players[socket.id].position,
    direction: players[socket.id].direction,
    players: GetAllPlayers()
  });
  socket.broadcast.emit('player_join', { id: socket.id, position: players[socket.id].position });

  socket.on('request_direction_change', function (payload) {
    console.log('request_direction_change', payload, socket.id)
    if (players[socket.id]) {
      players[socket.id].direction = payload.direction;
    }
  });
});

http.listen(3000, function () {
  console.log('started on port 3000');
});

setInterval(function () {
  if (ArePlayersMoving()) {
    io.emit('update', GetAllPlayers());
  }
  // io.emit('interval');
}, 10);