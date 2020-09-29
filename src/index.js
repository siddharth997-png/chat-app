const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { FILE } = require('dns')
const {generateMessage,generateLocationMessage} = require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0

io.on('connection', (socket) => {
    console.log('New WebSocket connection finally')

    socket.on('join', ({username, room}, cb) => {

        const {error,user} = addUser({ id: socket.id, username, room })

        if(error){
            return cb(error)
        }

        socket.join(user.room)

        socket.emit('message',generateMessage('Admin','Welcome'))
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined!`))

        io.to(user.room).emit('roomData', {
            room : user.room,
            users : getUsersInRoom(user.room)
        })

        cb()
    } )

    socket.on('sendMessage',(message,cb)=>{
        const user = getUser(socket.id)
        const filter = new Filter()
        //io.emit('message',filter.clean(message))
        if(!filter.clean(message)){
            return cb('Bitch bad words are not allowed')
        }

        io.to(user.room).emit('message',generateMessage(user.username,message))
        cb()
    })

    socket.on('sendLocation', ({latitude,longitude},cb)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${latitude},${longitude}`))
        cb()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user) {
            io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left the chat!`))
            io.to(user.room).emit('roomData', {
                room : user.room,
                users : getUsersInRoom(user.room)
            })
        }
        
        
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})