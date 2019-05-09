class Net {
    constructor() {
        this.socket = io.connect(Settings.serverAddress)
        this.socket.on('room-list', data => {
            console.log('room-list')
            ui.showRoomList(data)
        })
        this.socket.on('refresh', data => {
            console.log('refresh')
            ui.refreshRoomList(data)
        })
        this.socket.on('test', room => {
            console.log(room)
        })
    }
    login(nick) {
        this.socket.emit('login', { nick: nick })
    }
    joinRoom(id) {
        this.socket.emit('join-room', { id: id })
    }
}