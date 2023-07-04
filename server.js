const express = require('express')
const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 3000

// app.use(express.static(__dirname + '/public'))

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
// })

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})



// Socket 
const io = require('socket.io')(http)
let clients = {};

io.sockets.on('connection', (socket) => {
    console.log('Connected... To Websocket')
    socket.on('signin', function(id){
        clients[id] = socket;
        console.log('Clients ==> ', clients)

    })

    console.log('======================= ********************* ===================================')

    //Sending Message
    socket.on('sendMessage', function(msg){
        let targetId = msg.targetId;
        let data = {
            chatResponse:{
                image:msg.image,
                msg : msg.msg,
                time: msg.time,
                userId: msg.userId,
                targetId: msg.targetId
            }
            
        }
        if(clients[targetId]){
            clients[targetId].emit('receiveMessage', data)
        }
    })
})

  