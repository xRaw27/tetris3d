const Block = require('./Block')
const shapes = require('./Shapes')

class Gameroom {
    constructor(id, socket, io) {
        this.id = id
        this.name = socket.nick + '-room'
        this.players = []
        this.blocks = []
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
        //io.to(this.id).emit('start-game2')
        this.addBlock(io)
    }
    moveBlock(io, direction) {
        this.block.moveBlock(direction)
        io.to(this.id).emit('update-block', { block: this.block.getBlocks() })
    }
    addBlock(io) {
        this.block = new Block(3, 10, 4, [[1, 0, 0], [0, 0, 0], [-1, 0, 0], [0, 1, 0]])
        io.to(this.id).emit('add-block', { block: this.block.getBlocks() })
        // this.fallingInterval = true
        // let interval = setInterval(() => {
        //     if (this.fallingInterval) {
        //         io.to(this.id).emit('block-fall')
        //     }
        // }, 500)
    }

}
module.exports = Gameroom