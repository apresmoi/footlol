var express = require('express');
var body_parser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
  path: '/ws'
});

var { Match } = require('./models.js')

app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

const room = "main"
let matches = {
  [room]: new Match("room", io)
}

io.on('connection', function (socket) {
  console.log(socket.id + ' connected');

  const { name, champion } = socket.handshake.query

  matches[room].addPlayer(socket, socket.id, name, champion)

  socket.on('disconnect', function (ff) {
    console.log(socket.id + ' disconnected');

    matches[room].removePlayer(socket, socket.id);
  });

  socket.on('request_direction_change', function (payload) {
    matches[room].playerDirectionChanged(socket.id, payload.direction)
  });
  socket.on('request_key_press', function (payload) {
    matches[room].playerKeyPress(socket.id, payload.code)
  });
});

http.listen(3000, function () {
  console.log('started on port 3000');
});

