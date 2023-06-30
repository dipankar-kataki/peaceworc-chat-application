const { io } = require("socket.io-client");
const socket = io();
socket.on("connect", () => {
    console.log("Client Socket Connection Established"); // x8WIv7-mJelg7on_ALbx
});
