const express = require('express')
const app = express()
const http = require('http').createServer(app)
const axios = require('axios');

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
        if(! clients.hasOwnProperty(clients[id])){
            clients[id] = socket;
        }
        // console.log('Clients ==> ', clients)

    })

    console.log('======================= ********************* ===================================')

    //Sending Message
    socket.on('sendMessage', function(msg){
        console.log('Message Received ====>', msg)
        let targetId = msg.targetId;
        let data = {
            chatResponse:{
                image: msg.image,
                msg : msg.msg,
                time: msg.time,
                userId: msg.userId,
                targetId: msg.targetId,
                token: msg.token
            }
            
        }

        // const messageData = {
        //     sent_by: msg.userId,
        //     received_by: msg.targetId,
        //     message:  msg.msg,
        //     image_path:  msg.image,
        // };
        if(clients[targetId]){
            clients[targetId].emit('receiveMessage', data)

            // // Send the POST request
            // axios.post('http://localhost:8000/chatting/upload-message', data)
            // .then(response => {
            //     console.log('Message sent successfully');
            //     console.log('Response From Laravel ==>',response.data);
            // })
            // .catch(error => {
            //     console.error('Error sending message:', error.response.data);
            // });
        }else{
            console.log('Oops! Target-Id Not Found. Message Not Sent.')
        }

        
    })
})

  