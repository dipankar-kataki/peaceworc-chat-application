const express = require('express')
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express()
const port = process.env.port || 3000

//Creating Http server
const http = createServer(app)

app.get('/', (req, res) => {
    res.send('Welcome! Secure Server Connected')
})

//Socket Connection
const io = new Server(http, { serveClient: false });

io.on("connection", (socket) => {
    console.log('Connected To Socket Server')
});

http.listen(port);