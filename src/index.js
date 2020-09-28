const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirPath = path.join(__dirname,'../public')

app.use(express.static(publicDirPath))

io.on('connection',()=>{
    console.log('New websocket Connection!')
})

server.listen(port,()=>{
    console.log('Server Running on port : ',port)
})