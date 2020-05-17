import * as express from 'express';
import * as body_parser from 'body-parser';
import * as socketio from 'socket.io'
import { Room } from './classes/room';
import { champions } from './league/champions';
import { Champion } from './league/classes';

const app = express();
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

const http = require('http').Server(app);
const io = socketio(http, { path: '/ws' });

let roomId = '/ao'
let matches = {
  [roomId]: new Room(roomId, "Always open", io.of(roomId))
}

const newID = (): string => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnoprqstuvwxyz012345789"
  let id = ""

  while (id === "" || Object.keys(matches).includes(id)) {
    id = ""
    for (let i = 0; i < 20; i++) {
      id += letters[Math.trunc(Math.random() * letters.length)]
    }
  }

  return id
}


//routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.get('/api/rooms', function (req, res) {
  res.status(200)
    .send(Object
      .keys(io.nsps)
      .filter(id => matches[id])
      .map(id => {
        return {
          id,
          name: matches[id]._name,
          players: Object.keys(io.nsps[id].connected).length
        }
      }));
});

app.post('/api/rooms', (req, res) => {
  const name: string = req.body.name as string
  if (name && name.length > 5) {
    console.log(name, req.body)
    const id = '/' + newID()
    matches[id] = new Room(id, name, io.of(id))
    matches[id].allPlayersDisconnected = () => {
      delete matches[id]
    }
    res.status(201).send({
      id,
      name
    })
    return;
  }
  res.status(500).send({
    error: "Name min length 6"
  })
})

app.get('/api/champions', (req, res) => {
  res.status(200).send(Object.keys(champions).map(name => {
    const champion: Champion = champions[name]('LEFT')
    return champion.serialize()
  }))
})

http.listen(3000, function () {
  console.log('started on port 3000');
  process.on("SIGINT", closeApp);
  process.on("SIGTERM", closeApp);
});

function closeApp() {
  process.exit(0)
}

export default app