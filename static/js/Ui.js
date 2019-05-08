class Ui {
    constructor() {
        this.waitingMain = $('#waiting')
        this.loginMain = $('#login-div')
        this.bgDiv = $("#bg-div")
        this.rootDiv = $("#root")
    }

    init(msg) {
        console.log('init: ' + msg)
        $('#login-bt').on('click', () => {
            net.login($('#nick').val())
        })
    }

    startWaiting() {
        this.loginMain.css('display', 'none')
        this.waitingMain.css('display', '')
    }

    startGame() {
        console.log('START GAME!!!')
        this.bgDiv.css('display', 'none')
        this.rootDiv.css('display', '')
    }

}