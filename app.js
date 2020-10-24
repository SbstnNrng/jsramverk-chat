const express = require('express');
const app = express();
const cors = require('cors');
const mongo = require("mongodb").MongoClient;
const dsn =  "mongodb://localhost:27017/chatLog";
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on('connection', socket => {
    console.info("User connected");
    socket.on('send message', body => {
        io.emit('message', body);
        saveMsg(dsn, "messages", body.body);
    });
});

app.get("/old", async (request, response) => {
    try {
        let res = await findInCollection(dsn, "messages", {}, {}, 0);

        console.log(res);
        response.json(res);
    } catch (err) {
        console.log(err);
        response.json(err);
    }
});

server.listen(3000);

async function findInCollection(dsn, colName, criteria, projection, limit) {
    const client  = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);
    const res = await col.find(criteria, projection).limit(limit).toArray();

    await client.close();

    return res;
}

async function saveMsg(dsn, colName, body) {
    const client  = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);

    await col.insertOne( { msg: body } );
    //await col.deleteMany();

    await client.close();
}