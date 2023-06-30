
const socket = io()
// socket.on("connect", () => {
//     console.log("Client Socket Connection Established");
// });
socket.on('test-msg', (msg) => {
    console.log('Message Recieved', msg)
})