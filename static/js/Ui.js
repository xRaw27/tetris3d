class Ui {
    constructor() {
        this.loginMain = $('#login-div')
        this.roomsMain = $('#rooms-div')
        this.bgDiv = $('#bg-div')
        this.rootDiv = $('#root')
        this.playerList = $('#player-list')
        this.roomList = $('#room-list')
        this.init()
    }

    init() {
        $('#login-bt').on('click', () => {
            net.login($('#nick').val())
        })
        $('#create-room-bt').on('click', () => {
            net.createRoom()
        })
    }

    showRoomList(data) {
        $('#title').text('Witaj ' + data.nick + '!')
        this.loginMain.css('display', 'none')
        this.roomsMain.css('display', 'flex')
        this.playerList.empty()
        this.roomList.empty()
        data.playerList.forEach(player => {
            this.playerList.append($('<div class="player-row">').append(player))
        })
        data.roomList.forEach(room => {
            this.roomList.append($('<div class="room-row">').append(room.name).on('click', () => {
                net.joinRoom(room.id)
            }))
        })
    }
    refreshRoomList(data) {
        this.playerList.empty()
        this.roomList.empty()
        data.playerList.forEach(player => {
            this.playerList.append($('<div class="player-row">').append(player))
        })
        data.roomList.forEach(room => {
            this.roomList.append($('<div class="room-row">').append(room.name).on('click', () => {
                net.joinRoom(room.id)
            }))
        })
    }

    startGame() {
        console.log('START GAME!!!')
        this.bgDiv.css('display', 'none')
        this.rootDiv.css('display', '')
    }
}