console.log('running')
const socket = io();
socket.on('greeting-from-server', function (message) {
    console.log(message.greeting)

    socket.emit('greeting-from-client', {
        greeting: 'Hello Server'
    });
});