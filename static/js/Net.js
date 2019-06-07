class Net {
    constructor() {
        this.socket = io.connect(Settings.serverAddress)
        this.socket.on('room-list', data => {
            console.log('room-list')
            ui.showRoomList(data)
        })
        this.socket.on('refresh-rooms', data => {
            console.log('refresh-rooms')
            ui.refreshRoomList(data)
        })
        this.socket.on('leave-room', data => {
            ui.hideRoom()
            ui.showRoomList(data)
            // ui.refreshRoomList(data)
        })
        this.socket.on('refresh-room', data => {
            console.log('refresh-room')
            console.log(data)
            ui.refreshRoom(data)
        })
        this.socket.on('add-block', data => {
            console.log(data)
            game.addBlock(data)
        })
        this.socket.on('block-fall', () => {
            game.blockFall()
        })
        this.socket.on('connect-to-room', data => {
            ui.connectToRoom(data)
        })
        this.socket.on('disconnect-to-room', data => {
            console.log(data)
            ui.hideJoinRoomAlert()
            ui.hideCreateRoom()
        })
        this.socket.on('update-block', data => {
            game.updateBlock(data)
        })
        this.socket.on('static-blocks', data => {
            game.staticBlocksUpdate(data)
        })
        this.socket.on('game-started', () => {
            ui.startGame()
        })
        this.socket.on('registration', data => {
            if (data.status == 'DB_ERROR') {
                // ui.hideDivWaiting()
                ui.hideRegEmptyAlert()
                ui.showAlert(data.status)
                return
            }
            if (data.status == 'USER_EXIST') {
                ui.showRegUsernameAlert()
                ui.clearRegPass()
                return
            }
            ui.showAlert(data.status)
            ui.clearRegInputs()
            // ui.hideDivWaiting()
        })
        this.socket.on('login', data => {
            if (data.status == 'DB_ERROR') {
                // ui.hideDivWaiting()
                ui.showAlert(data.status)
                return
            }
            if (data.status == "USER_NO_EXIST") {
                console.log("no exist")
                ui.hideLoginEmptyAlert()
                ui.hideLoginPassAlert()
                ui.showLoginUsernameAlert()
                return
            }
            if (data.status == "BAD_PASSWORD") {
                ui.hideLoginEmptyAlert()
                ui.hideLoginUsernameAlert()
                ui.showLoginPassAlert()
                return
            }
            if (data.status == "IS_LOGGED") {
                ui.hideLoginPassAlert()
                ui.hideLoginUsernameAlert()
                ui.showAlert(data.status)
                return
            }
            ui.clearLoginPassInput()
            // ui.hideDivWaiting()
            // ui.showAlert(data.status)
        })
        this.socket.on('logout', () => {
            console.log("logout")
            ui.hidePlayerBestScoreHeader()
            ui.hideRoom()
            ui.hideRoomList()
            ui.showBtShowLogin()
            ui.hideBtLogout()
            ui.showRegMain()
            ui.showAlert("LOGOUT")
        })
        this.socket.on('player-turn', data => {
            gameUi.updatePlayerTurn(data.turn)
        })
        this.socket.on('show-next-block', data => {
            console.log(data)
            gameUi.updateNextBlock(data.blockName)
        })
        this.socket.on('update-score', data => {
            console.log(data.score)
            gameUi.updateScore(data.score)
        })
        this.socket.on('game-over', data => {
            this.socket.emit('game-ended')
            gameUi.showGameOverAlert(data.score)
        })
        this.socket.on('set-score', data => {
            ui.showPlayerBestScoreHeader()
            ui.updatePlayerScore(data.score)
        })
        this.socket.on('can-not-join', () => {
            console.log("can not join")
            ui.showJoinRoomAlert()
        })
    }
    login(username, password) {
        this.socket.emit('login', { username: username, password: password })
    }
    logout() {
        this.socket.emit('logout')
    }
    register(username, password) {
        this.socket.emit('registration', { username: username, password: password })
    }
    joinRoom(id) {
        this.socket.emit('join-room', { id: id })
    }
    leaveRoom() {
        this.socket.emit('leave-room')
    }
    createRoom(roomName) {
        var data = { roomName: roomName }
        this.socket.emit('create-room', data)
    }
    startGame() {
        console.log("start game")
        this.socket.emit('start-game')
    }
    moveBlock(direction) {
        this.socket.emit('block-control', { action: 'move-block', direction: direction })
    }
    rotateBlockZ() {
        this.socket.emit('block-control', { action: 'rotate-block-z' })
    }
    rotateBlockY() {
        this.socket.emit('block-control', { action: 'rotate-block-y' })
    }
    saveScore() {
        this.socket.emit('save-score')
    }
}