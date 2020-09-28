const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { FILE } = require('dns')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0

io.on('connection', (socket) => {
    console.log('New WebSocket connection finally')
 
    socket.emit('message', 'Welcome new User')
    socket.broadcast.emit('message','A new User has joined!')

    socket.on('sendMessage',(message,cb)=>{

        const filter = new Filter()
        //io.emit('message',filter.clean(message))
        if(!filter.clean(message)){
            return cb('Bitch bad words are not allowed')
        }

        io.emit('message',message)
        cb()
    })

    socket.on('sendLocation', ({latitude,longitude},cb)=>{
        io.emit('message',`https://google.com/maps?q=${latitude},${longitude}`)
        cb()
    })

    socket.on('disconnect', () => {
        io.emit('message','A user has disconnected!')
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})