class GameUi {
    constructor() {
        this.scoreBoardMain = $('#score-board')
        this.helpPanelMain = $('#help-panel')
        this.gameHelpMain = $('#game-help')
        this.playerTurn = $('#player-turn')
        this.h3ActualScore = $('#actual-score')
        this.imgNextBlock = document.getElementById('next-block-img')

        this.gameOverAlertMain = $('#game-over-alert-main')
        this.h3EndScore = $('#end-score')
        this.gameOverOut = $('#game-over-out-bt')

    }
    updatePlayerTurn(turn) {
        this.playerTurn.text(turn)
    }
    showGameHelpMain() {
        this.gameHelpMain.css('display', '')
    }
    showScoreBoardMain() {
        console.log(this.scoreBoardMain)
        this.helpPanelMain.css('display', '')
        this.scoreBoardMain.css('display', '')
    }
    updateScore(score) {
        this.h3ActualScore.text(score)
    }
    updateNextBlock(name) {
        switch (name) {
            case 'BlockI':
                this.imgNextBlock.src = '../gfx/blockI.png'
                break
            case 'BlockZ':
                this.imgNextBlock.src = '../gfx/blockZ.png'
                break
            case 'BlockS':
                this.imgNextBlock.src = '../gfx/blockS.png'
                break
            case 'BlockT':
                this.imgNextBlock.src = '../gfx/blockT.png'
                break
            case 'BlockL':
                this.imgNextBlock.src = '../gfx/blockL.png'
                break
            case 'BlockJ':
                this.imgNextBlock.src = '../gfx/blockJ.png'
                break
            case 'BlockO':
                this.imgNextBlock.src = '../gfx/blockO.png'
                break
            case 'TNT':
                this.imgNextBlock.src = '../gfx/tnt.jpg'
                break
        }
    }
    hideGameOverAlert() {
        this.gameOverAlertMain.hide(300)
        this.gameOverOut.off()
    }
    showGameOverAlert(score) {
        this.gameOverAlertMain.show(300)
        this.h3EndScore.text(score)
        this.gameOverOut.on('click', () => {
            this.hideGameOverAlert()
            net.saveScore()
            ui.divBg.css('display', '')
            ui.divRoot.css('display', 'none')
            this.scoreBoardMain.css('display', 'none')
            this.helpPanelMain.css('display', 'none')
            this.gameHelpMain.css('display', 'none')
            ui.roomsMain.css('display', '')
            game.reset()
        })
    }
}