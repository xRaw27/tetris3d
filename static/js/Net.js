class Net {
    constructor() {
        this.socket = io.connect(Settings.serverAddress)
        this.socket.on('init', data => {
            console.log(data)
            ui.init(data.users)
        })
        this.socket.on('wait', data => {
            if (data.wait) {
                ui.startWaiting()
            } else {
                ui.startGame()
            }

        })
    }
    login(nick) {
        this.socket.emit('login', { nick: nick })
    }
}