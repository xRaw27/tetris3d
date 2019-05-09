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
    }

    showRoomList(data) {
        $('#title').text('Witaj ' + data.nick + '!')
        this.loginMain.css('display', 'none')
        this.roomsMain.css('display', 'flex')
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
        data.playerList.forEach(player => {
            this.playerList.append($('<div class="player-row">').append(player))
        })
    }

    // startWaiting() {
    //     this.loginMain.css('display', 'none')
    //     this.waitingMain.css('display', '')
    // }

    startGame() {
        console.log('START GAME!!!')
        this.bgDiv.css('display', 'none')
        this.rootDiv.css('display', '')
    }
}