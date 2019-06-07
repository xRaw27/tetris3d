const express = require("express")
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const path = require('path')
const uuidV4 = require('uuid/v4')
const mongoClient = require('mongodb').MongoClient
const bcrypt = require('bcrypt')
const shapes = require('./Shapes')
const Gameroom = require('./Gameroom')
const Database = require("./Database")
let uri = "mongodb://localhost"
let db = new Database(mongoClient, uri, "users")

app.use(express.static('static'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/views/index.html'))
})

let players = []
let rooms = []

function getPlayerUsernames() {
    let playersNames = []
    players.forEach(player => {
        playersNames.push(player.username)
    })
    return playersNames
}

io.on('connection', socket => {
    socket.loggedIn = false
    socket.connectedToRoom = false

    socket.on('login', data => {
        if (socket.loggedIn) return
        let username = data.username
        let password = data.password
        db.loginUser(username, password, bcrypt, data => {
            if (data.status != "SUCCESS") {
                socket.emit("login", data)
                return
            }
            if (getPlayerUsernames().includes(data.username)) {
                data.status = "IS_LOGGED"
                socket.emit("login", data)
                return
            }
            socket.loggedIn = true
            socket.username = data.username
            let player = { username: username, id: socket.id }
            players.push(player)
            let usernames = getPlayerUsernames()
            socket.emit('set-score', { score: data.score })
            socket.emit('room-list', { roomList: rooms, playerList: usernames, username: socket.username + '(' + socket.id + ')' })

            players.forEach(player => {
                if (player.id != socket.id)
                    io.to(player.id).emit('refresh-rooms', { roomList: rooms, playerList: usernames })
            })
            // socket.broadcast.emit('refresh-rooms', { roomList: rooms, playerList: usernames })
            console.log('Użytkownik się połączył: ' + socket.username + 'Lista użytkoników: ' + usernames)
        })
    })

    socket.on('logout', () => {
        console.log("Logout")
        if (!socket.loggedIn) return
        let room = rooms.find(room => room.id === socket.roomId)
        if (room) {
            room.disconnectPlayer(socket)
            console.log("Użytkownik odłączył się od pokoju!")
        }
        let index = players.map(player => { return player.id }).indexOf(socket.id)
        players.splice(index, 1)
        socket.loggedIn = false
        let usernames = getPlayerUsernames()
        socket.emit('logout')
        socket.broadcast.emit('refresh-rooms', { roomList: rooms, playerList: usernames })
    })

    socket.on('registration', data => {
        // console.log("registration")
        let username = data.username
        let password = data.password
        db.registerUser(username, password, bcrypt, data => {
            if (data.status != "SUCCESS") {
                socket.emit("registration", data)
                return
            }
            socket.loggedIn = true
            socket.username = data.username
            let player = { username: username, id: socket.id }
            players.push(player)
            let usernames = getPlayerUsernames()
            socket.emit('set-score', { score: data.score })
            socket.emit('room-list', { roomList: rooms, playerList: usernames, username: socket.username + '(' + socket.id + ')' })

            players.forEach(player => {
                if (player.id != socket.id)
                    io.to(player.id).emit('refresh-rooms', { roomList: rooms, playerList: usernames })
            })

            console.log('Użytkownik się połączył: ' + socket.username + 'Lista użytkoników: ' + usernames)
        })
    })

    socket.on('create-room', data => {
        if (socket.connectedToRoom) return
        if (!socket.loggedIn) return
        let id = 'room-' + uuidV4()
        rooms.push(new Gameroom(data.roomName, id, socket, io, shapes))
        let usernames = getPlayerUsernames()
        io.emit('refresh-rooms', { roomList: rooms, playerList: usernames })
        //console.log(io.sockets.adapter.rooms)
    })

    socket.on('join-room', data => {
        if (socket.connectedToRoom) return
        if (!socket.loggedIn) return
        let room = rooms.find(room => room.id === data.id)
        if (room.gameStarted) {
            console.log("can not join")
            socket.emit('can-not-join')
            return
        }
        room.connectPlayer(socket, io)
        //console.log(io.sockets.adapter.rooms)
    })

    socket.on('leave-room', data => {
        if (!socket.connectedToRoom) return
        if (!socket.loggedIn) return
        // console.log(data)
        let room = rooms.find(room => room.id === socket.roomId)
        let usernames = getPlayerUsernames()
        // console.log("leave room")
        room.disconnectPlayer(socket)
        if (room.players.length == 0) {
            rooms.splice(rooms.indexOf(room), 1)
            io.emit('refresh-rooms', { roomList: rooms, playerList: usernames })
        }
        // socket.emit('refresh-rooms', { roomList: rooms, playerList: usernames })
        socket.emit('leave-room', { roomList: rooms, playerList: usernames })
    })

    socket.on('disconnect', () => {
        if (socket.loggedIn) {
            let room = rooms.find(room => room.id === socket.roomId)
            let usernames = getPlayerUsernames()
            if (room) {
                room.disconnectPlayer(socket)
                if (room.players.length == 0) {
                    rooms.splice(rooms.indexOf(room), 1)
                    io.emit('refresh-rooms', { roomList: rooms, playerList: usernames })
                }
                console.log("Użytkownik odłączył się od pokoju!")
            }
            let index = players.map(player => { return player.id }).indexOf(socket.id)
            players.splice(index, 1)
            socket.broadcast.emit('refresh-rooms', { roomList: rooms, playerList: usernames })
            console.log('Użytkownik się rozłączył: ' + socket.username + 'Lista użytkoników: ' + usernames)
        }
    })

    socket.on('start-game', () => {
        if (!socket.connectedToRoom) return
        room = rooms.find(room => room.id === socket.roomId)
        console.log("GAME STARTED")
        console.log(room.gameStarted)
        if (room.gameStarted) return
        room.startGame(io)
    })

    socket.on('block-control', data => {
        if (!socket.connectedToRoom) return
        room = rooms.find(room => room.id === socket.roomId)
        if (!room.canControl) return
        if (socket.id != room.playersInGame[room.playerTurn].id) return
        switch (data.action) {
            case 'move-block':
                room.moveBlock(data.direction)
                break
            case 'rotate-block-z':
                room.rotateBlockZ()
                break
            case 'rotate-block-y':
                room.rotateBlockY()
                break
        }
        room.updateBlock(io)
    })

    socket.on('game-ended', () => {
        if (!socket.connectedToRoom) return
        if (!socket.loggedIn) return
        socket.connectedToRoom = false
        let room = rooms.find(room => room.id === socket.roomId)
        db.updateScore(socket.username, room.score, data => {
            socket.emit('set-score', { score: data.score })
            if (data.status == 'DB_ERROR') {
                console.log('błąd bazy!')
                return
            }
            if (data.status == 'NO_CHANGED') {
                console.log('nie dokonano zmian')
                return
            }
            console.log('Wynik zaktualizowany!')
        })
        let usernames = getPlayerUsernames()
        rooms.splice(rooms.indexOf(room), 1)
        io.emit('refresh-rooms', { roomList: rooms, playerList: usernames })
    })
})

server.listen(3000, () => {
    console.log('Start serwera na porcie 3000')
})
