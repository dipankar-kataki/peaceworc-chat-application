const express = require('express')
const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Socket 
const io = require('socket.io')(http)

io.sockets.on('connection', (socket) => {
    console.log('Connected... To Websocket')
    console.log('Socket Id', socket.id)
    // socket.on('message', (msg) => {
    //     socket.broadcast.emit('message', msg)
    // })
    
    // socket.emit('welcome', data)

    //Sending Message

    socket.on('sendMessage', function(msg){
        // let messageForSending = JSON.parse(msg);
        let data = {
            chatResponse:{
                image:msg.image,
                msg : msg.msg,
                time: msg.time,
                userId: msg.userId
            }
            
        }
        // console.log(data)
        socket.broadcast.emit('receiveMessage', data)
    })

    // socket.on('chat', function(response) {
    //     console.log('subscribe trigged')
    //     const room_data = response
    //     console.log('Response From Android ==>',room_data)
    // })
})




// client-side
// io.on("connect", () => {
//     // socket.broadcast.emit('test-msg', hello)
   
//     io.emit('test-msg','Free portobond')
// });


  