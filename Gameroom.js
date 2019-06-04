const Block = require('./Block')
const shapes = require('./Shapes')

class Gameroom {
    constructor(id, socket, io) {
        this.id = id
        this.name = socket.nick + '-room'
        this.players = []
        this.blocks = []
        this.block = null
        this.connectPlayer(socket, io)
        this.fallingInterval = false
    }
    connectPlayer(socket, io) {
        this.players.push(socket.id)
        socket.connectedToRoom = true
        socket.roomId = this.id
        socket.join(this.id)
        socket.emit('connect-to-room', { name: this.name, players: this.players })
        socket.broadcast.to(this.id).emit('test', { name: this.name, players: this.players })
    }
    startGame(io) {
        io.to(this.id).emit('game-started')
        this.addBlock(io)
    }
    moveBlock(direction) {
        if (this.block == null) return
        this.block.moveBlock(direction)
    }
    rotateBlockZ() {
        if (this.block == null) return
        this.block.rotateBlockZ()
    }
    rotateBlockY() {
        if (this.block == null) return
        this.block.rotateBlockY()
    }
    updateBlock(io) {
        io.to(this.id).emit('update-block', { block: this.block.getBlocks() })
    }
    addBlock(io) {
        this.block = new Block(3, 15, 4, [[1, 0, 0], [0, 0, 0], [-1, 0, 0], [0, 1, 0]])
        io.to(this.id).emit('add-block', { block: this.block.getBlocks() })

        this.fallingInterval = true
        let interval = setInterval(() => {
            if (this.fallingInterval) {
                this.block.fall()
                this.updateBlock(io)
            }
        }, 500)
    }
    // blockFall(io) {

    // }

}
module.exports = Gameroom