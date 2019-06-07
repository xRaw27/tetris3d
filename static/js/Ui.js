class Ui {
    constructor() {
        this.playersInRoomList = $('#players-in-room-list')

        this.divBg = $('#bg-div')

        this.roomsMain = $('#rooms-main')
        this.roomMain = $('#room-main')
        this.divRoot = $('#root')
        this.divPlayerList = $('#player-list')
        this.divRoomList = $('#rooms-room-list')

        this.loginMain = $('#login-main')
        this.btLogin = $('#login-bt')
        this.inLoginUsername = $("#loginUsername")
        this.inLoginPass = $("#loginPass")
        this.loginUsernameAlert = $("#login-username-alert")
        this.loginPassAlert = $("#login-password-alert")
        this.loginEmptyAlert = $("#login-empty-alert")

        this.regMain = $("#reg-main")
        this.btReg = $("#reg-bt")
        this.inRegUsername = $("#regUsername")
        this.inRegPass = $("#regPass")
        this.regUsernameAler = $("#reg-username-alert")
        this.regEmptyAlert = $("#reg-empty-alert")

        this.divWaiting = $("#waiting")

        this.btAlert = $("#alert-bt")
        this.alertMain = $("#alert-main")
        this.divOverlay = $("#bg-overlay-div")
        this.alertMainOverlay = $("#alert-overlay-div")

        this.imgAlert = $("#alert-img")
        this.textAlert = $("#alert-text")

        this.btShowLogin = $("#show-login-bt")
        this.btLogout = $("#logout-bt")
        this.xLogin = $("#login-x")

        this.spRoomsTitle = $("#rooms-title")
        this.btStartGame = $("#start-game-bt")

        this.btLeaveRoom = $("#leave-room-bt")
        this.pRoomName = $("#room-name")

        this.btJoinRoom = $("#join-room-bt")
        this.btShowCreateRoom = $("#show-create-room-bt")
        this.joinRoomAlert = $("#join-room-alert")

        this.createRoomMain = $("#create-room-main")
        this.inRoomName = $("#roomName")
        this.btCreateRoom = $("#create-room-bt")
        this.xCreateRoom = $("#create-room-x")
        this.createRoomAlert = $("#create-room-name-alert")

        this.playerBestScoreMain = $("#player-best-score-main")
        this.h2PlayerBestScore = $("#player-best-score")

        this.selectedRoomId = null
        this.actuallRoomId = null

        this.init()
    }

    init() {
        this.addAlertClick()
        this.addRegClicks()
        this.addLoginClicks()
        this.addRoomListClicks()
        this.addRoomClicks()
    }

    addRegClicks() {
        this.btReg.on("click", () => {
            let username = this.inRegUsername.val().trim()
            let password = this.inRegPass.val().trim()
            if (username != "" && password != "") {
                this.hideRegEmptyAlert()
                net.register(username, password)
                // this.showDivWaiting()
            } else {
                this.hideRegUsernameAlert()
                this.showRegEmptyAlert()
            }
        })
    }

    addLoginClicks() {
        this.btShowLogin.on("click", () => {
            console.log("click")
            this.showloginMain()
        })

        this.btLogout.on("click", () => {
            net.logout()
        })

        this.xLogin.on("click", () => {
            this.hideloginMain()
        })

        this.btLogin.on("click", () => {
            let username = this.inLoginUsername.val().trim()
            let password = this.inLoginPass.val().trim()
            if (username != "" && password != "") {
                this.hideLoginEmptyAlert()

                net.login(username, password)
                // this.showDivWaiting()
            } else {
                this.hideLoginPassAlert()
                this.hideLoginUsernameAlert()
                this.showLoginEmptyAlert()
            }
        })
    }

    addAlertClick() {
        this.btAlert.on("click", () => {
            this.hideAlert()
        })

    }
    hideAlert() {
        this.alertMain.slideUp(500)
        this.alertMainOverlay.slideUp(500)
    }

    showJoinRoomAlert() {
        this.joinRoomAlert.show(300)
    }
    hideJoinRoomAlert() {
        this.joinRoomAlert.hide(300)
    }


    showRegEmptyAlert() {
        this.regEmptyAlert.show(300)
    }
    hideRegEmptyAlert() {
        this.regEmptyAlert.hide(300)
    }


    showLoginEmptyAlert() {
        this.loginEmptyAlert.show(300)
    }
    hideLoginEmptyAlert() {
        this.loginEmptyAlert.hide(300)
    }


    showRegUsernameAlert() {
        this.regUsernameAler.show(300)
    }
    hideRegUsernameAlert() {
        this.regUsernameAler.hide(300)
    }


    showLoginUsernameAlert() {
        this.loginUsernameAlert.show(300)
    }
    hideLoginUsernameAlert() {
        this.loginUsernameAlert.hide(300)
    }


    showLoginPassAlert() {
        this.loginPassAlert.show(300)
    }
    hideLoginPassAlert() {
        this.loginPassAlert.hide(300)
    }


    showCreateRoomAlert() {
        this.inRoomName.val('')
        this.createRoomAlert.show(300)
    }
    hideCreateRoomAlert() {
        this.createRoomAlert.hide(300)
    }


    showCreateRoom() {
        this.createRoomMain.show(300)
    }
    hideCreateRoom() {
        this.createRoomMain.hide(300)
    }


    // showDivWaiting() {
    //     this.divWaiting.css("display", "")
    // }
    // hideDivWaiting() {
    //     this.divWaiting.css("display", "none")
    // }


    showloginMain() {
        this.hideRegEmptyAlert()
        this.loginMain.slideDown(300)
        this.divOverlay.slideDown(300)
    }
    hideloginMain() {
        this.hideLoginUsernameAlert()
        this.hideLoginPassAlert()
        this.hideLoginEmptyAlert()
        this.loginMain.slideUp(300)
        this.divOverlay.slideUp(300)
        this.clearLoginInputs()
    }

    hideRegMain() {
        this.hideRegUsernameAlert()
        this.hideRegEmptyAlert()
        this.regMain.css("display", "none")
    }
    showRegMain() {
        this.regMain.css("display", "")
    }


    clearLoginInputs() {
        this.inLoginUsername.val('')
        this.inLoginPass.val('')
    }
    clearLoginPassInput() {
        this.inLoginPass.val('')
    }


    clearRegPass() {
        this.inRegPass.val('')
    }
    clearRegInputs() {
        this.inRegUsername.val('')
        this.inRegPass.val('')
    }


    showRoom() {
        this.roomMain.slideDown(300)
    }
    hideRoom() {
        this.roomMain.slideUp(300)
    }

    showBtShowLogin() {
        this.btShowLogin.css("display", "")
    }

    hideBtShowLogin() {
        this.btShowLogin.css("display", "none")
    }

    showBtLogout() {
        this.btLogout.css("display", "")
    }
    hideBtLogout() {
        this.btLogout.css("display", "none")
    }

    showPlayerBestScoreHeader() {
        this.playerBestScoreMain.css("display", "")
    }
    hidePlayerBestScoreHeader() {
        this.playerBestScoreMain.css("display", "none")
    }
    updatePlayerScore(score) {
        this.h2PlayerBestScore.text(score)
    }


    showAlert(type) {
        switch (type) {
            case "IS_LOGGED":
                this.imgAlert[0].src = "../gfx/fail.png"
                this.textAlert.text("Konto jest już w użytku!")
                break
            case "DB_ERROR":
                this.imgAlert[0].src = "../gfx/fail.png"
                this.textAlert.text("Błąd bazy danych!")
                break
            case "LOGOUT":
                this.imgAlert[0].src = "../gfx/success.png"
                this.textAlert.text("Wylogowano pomyślnie")
                break
        }

        this.alertMain.slideDown(300)
        this.alertMainOverlay.slideDown(300)
    }

    hideRoomList() {
        this.roomsMain.hide(300)
    }

    addRoomListClicks() {
        this.btJoinRoom.on("click", () => {
            if (!this.selectedRoomId) return
            net.joinRoom(this.selectedRoomId)
        })

        this.btShowCreateRoom.on("click", () => {
            this.inRoomName.val('')
            this.showCreateRoom()
            this.alertMainOverlay.show(300)
        })

        this.btCreateRoom.on("click", () => {
            if (this.inRoomName.val() == "") {
                this.showCreateRoomAlert()
                return
            }
            this.hideCreateRoomAlert()
            let roomName = this.inRoomName.val()
            this.inRoomName.val('')
            this.hideCreateRoom()
            this.alertMainOverlay.hide(300)
            net.createRoom(roomName)
            console.log("Tworzenie nowego pokoju")
        })

        this.xCreateRoom.on("click", () => {
            this.inRoomName.val('')
            this.hideCreateRoom()
            this.alertMainOverlay.hide(300)
        })
    }


    showRoomList(data) {
        this.hideBtShowLogin()
        this.showBtLogout()
        this.hideRegMain()
        this.hideloginMain()
        // this.hideDivWaiting()
        this.roomsMain.slideDown(300)

        console.log(data)
        this.divPlayerList.empty()
        this.divRoomList.empty()
        this.spRoomsTitle.text('Witaj ' + data.username + '!')
        this.roomsMain.css('display', 'flex')
        data.playerList.forEach(player => {
            this.divPlayerList.append($('<div class="player-row">').append(player))
        })
        data.roomList.forEach(room => {
            let row = $('<div class="rooms-row">')
            row.text(room.name)
            row.on("click", () => {
                console.log("click row room")
                $(".rooms-row").css("background", "")
                row.css("background", "rgba(0, 0, 0, 0.808)")
                this.selectedRoomId = room.id
            })
            this.divRoomList.append(row)
        })
    }


    refreshRoomList(data) {
        this.divPlayerList.empty()
        data.playerList.forEach(player => {
            this.divPlayerList.append($('<div class="player-row">').append(player))
        })
        this.divRoomList.empty()
        data.roomList.forEach(room => {
            let row = $('<div class="rooms-row">')
            row.text(room.name)
            row.on("click", () => {
                $(".rooms-row").css("background", "")
                row.css("background", "rgba(0, 0, 0, 0.808)")
                this.selectedRoomId = room.id
            })
            this.divRoomList.append(row)
        })
    }

    addRoomClicks() {
        this.btStartGame.on("click", () => {
            net.startGame()
        })

        this.btLeaveRoom.on("click", () => {
            this.selectedRoomId = null
            this.actuallRoomId = null
            net.leaveRoom(this.actuallRoomId)
        })
    }

    connectToRoom(data) {
        this.hideRoomList()
        this.showRoom()
        this.playersInRoomList.empty()
        this.pRoomName.text(data.name)
        console.log(data)
        this.actuallRoomId = data.id
        data.players.forEach(player => {
            this.playersInRoomList.append($('<div class="player-row">').append(player))
        })
    }

    refreshRoom(data) {
        this.playersInRoomList.empty()
        console.log(data)
        data.players.forEach(player => {
            this.playersInRoomList.append($('<div class="player-row">').append(player))
        })
    }


    startGame() {
        console.log('START GAME!!!')
        game.init()
        this.hideRoom()
        gameUi.showScoreBoardMain()
        gameUi.showGameHelpMain()
        this.divBg.css('display', 'none')
        this.divRoot.css('display', '')
    }
}