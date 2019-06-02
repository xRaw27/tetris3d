const express = require("express")
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const path = require('path')
const uuidV4 = require('uuid/v4')
const Gameroom = require('./Gameroom')

app.use(express.static('static'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/views/index.html'))
})

let players = []
let rooms = []

io.on('connection', socket => {
    socket.loggedIn = false
    socket.connectedToRoom = false

    socket.on('login', data => {
        if (socket.loggedIn) return
        socket.loggedIn = true
        socket.nick = data.nick
        players.push(data.nick)
        socket.emit('room-list', { roomList: rooms, playerList: players, nick: socket.nick + '(' + socket.id + ')' })
        socket.broadcast.emit('refresh', { roomList: rooms, playerList: players })
        console.log('Użytkownik się połączył: ' + socket.nick + 'Lista użytkoników: ' + players)
    })

    socket.on('create-room', () => {
        if (socket.connectedToRoom) return
        let id = 'room-' + uuidV4()
        rooms.push(new Gameroom(id, socket, io))
        io.emit('refresh', { roomList: rooms, playerList: players })
        //console.log(io.sockets.adapter.rooms)
    })

    socket.on('join-room', data => {
        if (socket.connectedToRoom) return
        let room = rooms.find(room => room.id === data.id)
        room.connectPlayer(socket, io)
        //console.log(io.sockets.adapter.rooms)
    })

    socket.on('disconnect', () => {
        if (socket.loggedIn) {
            players.splice(players.indexOf(socket.nick), 1)
            socket.broadcast.emit('refresh', { roomList: rooms, playerList: players })
            console.log('Użytkownik się rozłączył: ' + socket.nick + 'Lista użytkoników: ' + players)
        }
    })

    socket.on('start-game', () => {
        if (!socket.connectedToRoom) return
        room = rooms.find(room => room.id === socket.roomId)
        room.startGame(io)
    })

    socket.on('move-block', data => {
        if (!socket.connectedToRoom) return
        room = rooms.find(room => room.id === socket.roomId)
        console.log('He?')
        room.moveBlock(io, data.direction)
    })
})

server.listen(3000, () => {
    console.log('Start serwera na porcie 3000')
})
