"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const matter_js_1 = require("matter-js");
const room_1 = require("./classes/room");
const champions_1 = require("./league/champions");
const decomp = require('poly-decomp');
matter_js_1.Common.setDecomp(decomp);
const ENV_DEVELOPMENT = process.env.NODE_ENV === "development";
console.log(ENV_DEVELOPMENT ? "DEVELOPMENT ENVIRONMENT" : "PRODUCTION ENVIRONMENT");
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
const httpServer = (0, node_http_1.createServer)(app);
const socketServer = httpServer;
const io = new socket_io_1.Server(socketServer, {
    path: '/ws',
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
});
const port = Number(process.env.PORT ?? '3000');
let roomId = '/ao';
const matches = {
    [roomId]: new room_1.Room(roomId, "Always open", io.of(roomId))
};
const newID = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnoprqstuvwxyz012345789";
    let id = "";
    while (id === "" || Object.keys(matches).includes(id)) {
        id = "";
        for (let i = 0; i < 20; i++) {
            id += letters[Math.trunc(Math.random() * letters.length)];
        }
    }
    return id;
};
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
        };
    }));
});
app.post('/api/rooms', (req, res) => {
    const name = req.body.name;
    if (name && name.length > 5) {
        console.log(name, req.body);
        const id = '/' + newID();
        matches[id] = new room_1.Room(id, name, io.of(id));
        matches[id].allPlayersDisconnected = () => {
            delete matches[id];
        };
        res.status(201).send({
            id,
            name
        });
        return;
    }
    res.status(400).send({
        error: "Name min length 6"
    });
});
app.get('/api/champions', (req, res) => {
    res.status(200).send(Object.keys(champions_1.champions).map(name => {
        const champion = champions_1.champions[name]('LEFT');
        return champion.serialize();
    }));
});
socketServer.listen(port, function () {
    console.log(`started on port ${port}`);
    process.on("SIGINT", closeApp);
    process.on("SIGTERM", closeApp);
});
function closeApp() {
    process.exit(0);
}
exports.default = app;
//# sourceMappingURL=index.js.map