const express = require("express")
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const path = require('path')

app.use(express.static('static'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/views/index.html'))
})

let usersList = []

io.on('connection', socket => {
    let loggedIn = false
    let nick
    console.log('user connected')
    socket.emit('init', { users: "XD" })
    socket.on('login', data => {
        if (!loggedIn) {
            loggedIn = true
            nick = data.nick
            usersList.push(data.nick)
            if (usersList.length > 1) {
                console.log("can start!")
                io.emit("wait", { wait: false })
            } else {
                console.log("wait!")
                socket.emit("wait", { wait: true })
            }
        }
    })
    socket.on('disconnect', () => {
        if (loggedIn) {
            usersList.splice(usersList.indexOf(nick), 1)
            console.log('Użytkownik się rozłączył: ' + nick)
            console.log(usersList)
        }
    })
})

server.listen(3000, () => {
    console.log('Start serwera na porcie 3000')
})
