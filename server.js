const express = require("express")
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const path = require('path')
const uuidV4 = require('uuid/v4')

app.use(express.static('static'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/views/index.html'))
})

let players = []
let rooms = [{ id: 0, name: 'default_room_1', players: [] }, { id: 1, name: 'default_room_2', players: [] }]

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
        socket.connectedToRoom = true
        socket.roomId = id
        socket.join(id)
        rooms.push({
            id: id,
            name: socket.nick + '-room',
            players: [socket.id]
        })

        io.emit('refresh', { roomList: rooms, playerList: players })
        console.log(io.sockets.adapter.rooms)
    })
    socket.on('join-room', data => {
        if (socket.connectedToRoom) return

        socket.connectedToRoom = true
        let room = rooms.find(room => room.id === data.id)
        socket.join(room.id)
        room.players = Object.keys(io.sockets.adapter.rooms[room.id].sockets)

        io.sockets.in(room.id).emit('test', room)
        console.log(io.sockets.adapter.rooms)
    })
    socket.on('disconnect', () => {
        if (socket.loggedIn) {
            players.splice(players.indexOf(socket.nick), 1)

            socket.broadcast.emit('refresh', { roomList: rooms, playerList: players })
            console.log('Użytkownik się rozłączył: ' + socket.nick + 'Lista użytkoników: ' + players)
        }
    })
})

server.listen(3000, () => {
    console.log('Start serwera na porcie 3000')
})
