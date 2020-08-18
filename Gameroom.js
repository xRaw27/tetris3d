const Block = require('./Block')

class Gameroom {
    constructor(name, id, socket, io, shapes) {
        this.id = id
        this.name = name + '-room'
        this.players = []
        this.randomBlocks = []
        this.staticBlocks = []
        this.shapes = shapes
        this.blocks = []
        this.block = null
        this.gameStarted = false
        this.endGame = false
        this.canControl = true
        this.score = 0
        this.playerTurn = 0
        this.connectPlayer(socket, io)
        this.fallingInterval = false
    }
    createBlocksArray() {
        let array = []
        for (let x = 0; x < 14; x++) { // 14
            array.push([])
            for (let y = 0; y < 13; y++) {
                array[x].push([])
                for (let z = 0; z < 4; z++) {
                    array[x][y].push({ block: 0, color: 0 })
                }
            }
        }
        return array
    }
    getPlayerUsernames() {
        let playersNames = []
        this.players.forEach(player => {
            playersNames.push(player.username)
        })
        return playersNames
    }
    connectPlayer(socket) {
        var player = { username: socket.username, id: socket.id }
        this.players.push(player)
        socket.connectedToRoom = true
        socket.roomId = this.id
        socket.join(this.id)
        let usernames = this.getPlayerUsernames()
        socket.emit('connect-to-room', { id: this.id, name: this.name, players: usernames })
        console.log("room ID " + this.id)
        socket.broadcast.to(this.id).emit('refresh-room', { players: usernames })
        console.log(this.players)
    }
    disconnectPlayer(socket) {
        let index = this.players.map(player => { return player.id }).indexOf(socket.id)
        this.players.splice(index, 1)
        socket.connectedToRoom = false
        socket.roomId = null
        socket.leave(this.id)
        socket.emit('disconnect-to-room', { status: "disconnected" })
        let usernames = this.getPlayerUsernames()
        console.log(usernames)
        socket.broadcast.to(this.id).emit('refresh-room', { players: usernames })
    }
    startGame(io) {
        this.gameStarted = true
        this.playersInGame = this.players.slice(0)
        io.to(this.id).emit('game-started')
        this.staticBlocks = this.createBlocksArray()
        console.log(this.staticBlocks)
        let firstBlock = Math.floor(Math.random() * (this.shapes.length - 1))
        this.randomBlocks.push(firstBlock)
        this.addBlock(io)
    }
    moveBlock(direction) {
        if (this.block == null) return
        this.block.moveBlock(direction, this.staticBlocks)
    }
    rotateBlockZ() {
        if (this.block == null) return
        this.block.rotateBlockZ(this.staticBlocks)
    }
    rotateBlockY() {
        if (this.block == null) return
        this.block.rotateBlockY(this.staticBlocks)
    }
    updateBlock(io) {
        if (this.gameStarted) {
            io.to(this.id).emit('update-block', { block: this.block.getBlocks(), color: this.block.color })
        }
    }
    addBlock(io) {
        if (Math.floor(Math.random() * 150) == 0) {
            let nextBlock = this.shapes.length - 1
            this.randomBlocks.push(nextBlock)
        } else {
            let nextBlock = Math.floor(Math.random() * (this.shapes.length - 1))
            this.randomBlocks.push(nextBlock)
        }
        console.log(this.shapes[this.randomBlocks[1]].name)
        io.to(this.id).emit('show-next-block', { blockName: this.shapes[this.randomBlocks[1]].name })
        if (this.playerTurn < this.playersInGame.length - 1) this.playerTurn++
        else this.playerTurn = 0
        io.to(this.id).emit('player-turn', { turn: 'Kolej gracza:\n' + this.playersInGame[this.playerTurn].username })
        io.to(this.playersInGame[this.playerTurn].id).emit('player-turn', { turn: 'Twoja kolej!' })
        console.log("Kolej gracza: " + this.playersInGame[this.playerTurn].username)
        let randomBlock = this.randomBlocks[0]
        if (this.shapes[randomBlock].name == 'TNT') {
            this.block = new Block(6, 19, 1, this.shapes[randomBlock].shape, this.shapes[randomBlock].color, 2)
        }
        else {
            this.block = new Block(6, 19, 1, this.shapes[randomBlock].shape, this.shapes[randomBlock].color)
        }
        io.to(this.id).emit('add-block', { block: this.block.getBlocks(), color: this.block.color, type: this.block.type })
        this.blockFall(io)
        this.randomBlocks.shift()
    }
    blockFall(io) {
        let interval = setInterval(() => {
            this.canControl = true
            if (!this.block.fall(this.staticBlocks)) this.blockFallStop(io, interval)
            this.updateBlock(io)
        }, 200)
    }
    blockFallStop(io, interval) {
        this.canControl = false
        clearInterval(interval)
        let newStaticBlocks = this.block.getBlocks()
        let blockType = this.block.type
        newStaticBlocks.forEach(element => {
            if (element.y > 12) this.endGame = true
            else {
                this.staticBlocks[element.x][element.y][element.z].block = blockType
                this.staticBlocks[element.x][element.y][element.z].color = this.block.color
            }
        })
        if (this.endGame) return this.gameOver(io)
        this.checkLine(io)
        io.to(this.id).emit('static-blocks', { blocks: this.staticBlocks })
        this.addBlock(io)
    }
    checkLine(io) {
        let clearedLines = 0
        for (let y = 0; y < 13; y++) {
            let clear = true
            let tnt = false
            for (let x = 0; x < 14; x++) { // 14
                for (let z = 0; z < 4; z++) {
                    if (this.staticBlocks[x][y][z].block == 0) clear = false
                    if (this.staticBlocks[x][y][z].block == 2) tnt = true
                }
            }
            if (clear || tnt) {
                console.log("CZYSCIMY LINIE:" + y)
                this.clearLine(y)
                ++clearedLines
                --y
            }
        }
        if (clearedLines > 0) {
            if (clearedLines == 1) this.score += 100
            if (clearedLines == 2) this.score += 300
            if (clearedLines == 3) this.score += 500
            if (clearedLines >= 4) this.score += 800
            io.to(this.id).emit('update-score', { score: this.score })
        }
    }
    clearLine(line) {
        for (let y = line; y < 13; y++) {
            for (let x = 0; x < 14; x++) { // 14
                for (let z = 0; z < 4; z++) {
                    if (y == 12) {
                        this.staticBlocks[x][y][z].block = 0
                        this.staticBlocks[x][y][z].color = 0
                    }
                    else {
                        this.staticBlocks[x][y][z].block = this.staticBlocks[x][y + 1][z].block
                        this.staticBlocks[x][y][z].color = this.staticBlocks[x][y + 1][z].color
                    }
                }
            }
        }
    }
    gameOver(io) {
        console.log("GAME OVER")
        io.to(this.id).emit("game-over", { score: this.score })
        //this.resetRoom()
    }
    // resetRoom() {
    //     this.gameStarted = false
    //     this.randomBlocks = []
    //     this.staticBlocks = []
    //     this.blocks = []
    //     this.block = null
    //     this.endGame = false
    //     this.canControl = true
    //     this.score = 0
    //     this.playerTurn = 0
    //     this.fallingInterval = false
    // }
}
module.exports = Gameroom