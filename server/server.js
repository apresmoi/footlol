var express = require('express');
var body_parser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
  path: '/ws'
});

var { Player, Ball } = require('./models.js')

app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

const arePlayersMoving = () => {
  return Object.keys(players).some(key => players[key].direction.dx || players[key].direction.dy)
}

const getAllPlayers = () => {
  return Object.keys(players).reduce((r, key) => {
    if (io.clients().connected[key]) {
      players[key].update(players[key].direction)
      r[key] = players[key].serialize()
    }
    return r;
  }, {})
}

const removePlayer = (id) => {
  players = Object.keys(players).reduce((result, key) => {
    if (key !== id) result[key] = players[key]
    return result
  }, {})
}

const [width, height] = [900, 300]
let players = {}
let ball = new Ball(width / 2, height / 2)

const positions = [
  [[100, 150]],
  [[800, 150]]
]

const addPlayer = (id, name, champion) => {
  const side = Object.keys(players).length % 2 ? 0 : 1

  const sideLength = Object.keys(players).filter(key => players[key].side === side).length
  const [x, y] = positions[side][sideLength]
  players[id] = new Player(id, name, champion, side, x, y)
}

io.on('connection', function (socket) {
  const { name, champion } = socket.handshake.query

  console.log(socket.id + ' connected');

  addPlayer(socket.id, name, champion)

  socket.on('disconnect', function (ff) {
    socket.broadcast.emit('player_leave', { id: socket.id });
    console.log(socket.id + ' disconnected');
    removePlayer(socket.id);
  });

  socket.emit('login_success', {
    ...players[socket.id].serialize(),
    players: getAllPlayers(),
    ball: ball
  });
  socket.broadcast.emit('player_join', players[socket.id].serialize());

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
  if (arePlayersMoving()) {
    handleCollisions()
    io.emit('update', {
      players: getAllPlayers(),
      ball: ball
    });
  }
}, 20);

const handleCollisions = () => {
  ball.update({ dx: 0, dy: 0 })
  Object.keys(players).forEach(id => {
    if (
      players[id].isTouchingBall(ball.position)
    ) {
      console.log('moving ball')
      ball.shootBall(players[id])
      // ball.update({ ...players[id].direction })
    }
  })
}