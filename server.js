const express = require("express")
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const path = require('path')

app.use(express.static('static'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/views/index.html'))
})

let players = []
let rooms = [{ id: 0, name: 'default_room_1', players: [] }, { id: 1, name: 'default_room_2', players: [] }]

io.on('connection', socket => {
    let loggedIn = false
    let nick
    console.log('user connected')
    socket.on('login', data => {
        if (!loggedIn) {
            loggedIn = true
            nick = data.nick
            players.push(data.nick)
            console.log('Użytkownik się połączył: ' + nick)
            socket.emit('room-list', { roomList: rooms, playerList: players, nick: nick })
            socket.broadcast.emit('refresh', { roomList: rooms, playerList: players })
        }
    })
    socket.on('create-room', () => {

    })
    socket.on('join-room', data => {
        let room = rooms.find(room => room.id === data.id)
        room.players.push(nick)
        socket.join('room-' + room.id)
        io.sockets.in('room-' + room.id).emit('test', room)
        console.log(io.sockets.adapter.rooms)
    })
    socket.on('disconnect', () => {
        if (loggedIn) {
            players.splice(players.indexOf(nick), 1)
            socket.broadcast.emit('refresh', { roomList: rooms, playerList: players })
            console.log('Użytkownik się rozłączył: ' + nick)
            console.log(players)
        }
    })
})


// if (playersList.length > 1) {
//     console.log("can start!")
//     io.emit("wait", { wait: false })
// } else {
//     console.log("wait!")
//     socket.emit("wait", { wait: true })
// }

server.listen(3000, () => {
    console.log('Start serwera na porcie 3000')
})
