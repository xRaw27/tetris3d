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
        this.socket.on('add-block', data => {
            console.log(data)
            game.addBlock(data.block)
        })
        this.socket.on('block-fall', () => {
            game.blockFall()
        })
        this.socket.on('connect-to-room', data => {
            ui.connectToRoom(data)
        })
        this.socket.on('update-block', data => {
            game.updateBlock(data.block)
        })
    }
    login(nick) {
        this.socket.emit('login', { nick: nick })
    }
    joinRoom(id) {
        this.socket.emit('join-room', { id: id })
    }
    createRoom() {
        this.socket.emit('create-room')
    }
    startGame() {
        this.socket.emit('start-game')
    }
    moveBlock(direction) {
        this.socket.emit('move-block', { direction: direction })
    }
}