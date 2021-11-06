const chatFunction =(socket,io) => {
    socket.emit('greeting-from-server', {
        greeting: 'Hello Client'
    });
    socket.on('greeting-from-client', function (message) {
        console.log(message);
    });
} 

module.exports = chatFunction