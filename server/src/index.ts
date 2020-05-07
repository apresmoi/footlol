import * as express from 'express';
import * as body_parser from 'body-parser';
import * as socketio from 'socket.io'
import { Match } from './models'

const app = express();
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

const http = require('http').Server(app);
const io = socketio(http, { path: '/ws' });


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

export default app