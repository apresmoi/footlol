import express from 'express';
import { createServer as createHttpServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import { Common } from 'matter-js';
import { Room } from './classes/room';
import { champions } from './league/champions';
import { Champion } from './league/classes';

const decomp = require('poly-decomp');
Common.setDecomp(decomp);

const ENV_DEVELOPMENT = process.env.NODE_ENV === "development";
console.log(ENV_DEVELOPMENT ? "DEVELOPMENT ENVIRONMENT" : "PRODUCTION ENVIRONMENT");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const httpServer = createHttpServer(app);
const socketServer = httpServer;

const io = new SocketIOServer(socketServer, {
  path: '/ws',
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
});
const port = Number(process.env.PORT ?? '3000');

let roomId = '/ao'
const matches: { [id: string]: Room } = {
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
      .keys(matches)
      .map(id => {
        return {
          id,
          name: matches[id]._name,
          players: io.of(id).sockets.size
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

socketServer.listen(port, function () {
  console.log(`started on port ${port}`);
  process.on("SIGINT", closeApp);
  process.on("SIGTERM", closeApp);
});

function closeApp() {
  process.exit(0)
}

export default app
