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
let typing=false;
let timeout=undefined;

io.sockets.on('connection', (socket) => {
    console.log('Connected... To Websocket')
    socket.on('signin', function(id){
        if(! clients.hasOwnProperty(clients[id])){
            clients[id] = socket;
        }
        // console.log('Clients ==> ', clients)

    })

    console.log('======================= ********************* ===================================')

    // const apiUrl = 'http://143.110.244.161/api/caregiver/chatting/upload-message';
    const apiMessageUploadUrl = 'http://127.0.0.1:8000/api/caregiver/chatting/upload-message';
    const apiMessageSeenUrl = 'http://127.0.0.1:8000/api/caregiver/chatting/update-message';

    const headers = {
        Authorization: null,
        'Content-Type': 'application/json',
    };

    //Typing Indication
    // socket.on('typing', (typing)=>{
    //     console.log('Typing Data===>',typing)
    //     if(typing==true){
    //         socket.emit('displayTyping', typing)
    //     }else{
    //         socket.emit('displayTyping', typing)
    //     }
    // })

    //Sending Message
    socket.on('sendMessage', function(msg){
        
        let targetId = msg.targetId;
        let data = {
            chatResponse:{
                image: msg.image,
                msg : msg.msg,
                time: msg.time,
                userId: msg.userId,
                targetId: msg.targetId,
                jobId: msg.jobId,
                messageId: msg.messageId,
                token: `Bearer 2|RR8vxXeZAD4e9W23RgIvgpifX2MCtPFcRfQ2AidQ`
                // token: msg.token
            }
            
        }
        console.log('Message Received ====>', data)

        const accessToken = data.chatResponse.token;
        
        headers.Authorization = accessToken

        


        if(clients[targetId]){
            clients[targetId].emit('receiveMessage', data)

            axios.post(apiMessageUploadUrl, data, {headers} )
            .then(response => {
                console.log('Response From Laravel ==>',response.data);
            })
            .catch(error => {
                console.error('Error sending message:', error.response);
            });
        }else{
            console.log('Oops! Target-Id Not Found. Message Not Sent.')
        }

        
    })

    socket.on('isMessageSeen', function(seenData){

        let data = {
            messageId : seenData.messageId,
            messageSeen: true
        }

        clients[seenData.targetId].emit('messageAck', data)

        if(seenData.targetId != null || seenData.targetId != ''){

            axios.post(apiMessageSeenUrl, seenData, {headers} )
            .then(response => {
                console.log('Response From Laravel For Seen ==>',response.data);
            })
            .catch(error => {
                console.error('Error sending message:', error.response);
            });

        }
    })
})

  