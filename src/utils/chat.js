const Filter = require('bad-words')

const chatFunction = (socket, io) => {

    socket.on('join', (options, callback) => {
        const room = options.room
        socket.join(room)

        callback()
    })

    socket.on('sendMessage',({message,user,room},callback)=>{
        const filter=new Filter()
        
        if(filter.isProfane(message)){
            return callback('ignored')
        }
        
        socket.broadcast.to(room).emit('receiveMessage',{user,message,createdAt : new Date().getTime()})
        callback()
    })

}

module.exports = chatFunction