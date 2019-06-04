module.exports = class Block {
    constructor(x, y, z, shape) {
        this.x = x
        this.y = y
        this.z = z
        this.shape = shape
        this.singleBlocks = []
        this.initBlock()
    }
    getBlocks() {
        return this.singleBlocks
    }
    consoleLog() {
        let tab = []
        this.singleBlocks.forEach(element => {
            tab.push([element.x, element.y, element.z])
        })
        console.log(tab)
    }
    initBlock() {
        this.shape.forEach(element => {
            let singleBlock = { x: this.x + element[0], y: this.y + element[1], z: this.z + element[2] }
            this.singleBlocks.push(singleBlock)
        })
        this.consoleLog()
    }
    fall() {
        if (!this.fallCheck()) {
            console.log("STOP!!!!")
        }
        this.y -= 1
        this.singleBlocks.forEach(element => {
            element.y -= 1
        })
        this.consoleLog()
    }
    fallCheck() {
        let canFall = true
        this.singleBlocks.forEach(element => {
            if (element.y - 1 < 0) return canFall = false
        })
        return canFall
    }
    rotateBlockZ() {
        if (!this.rotateBlockZCheck()) return
        this.singleBlocks.forEach(element => {
            let x = element.x - this.x
            let y = element.y - this.y
            element.x = this.x + y
            element.y = this.y - x
        })
        this.consoleLog()
    }
    rotateBlockY() {
        if (!this.rotateBlockYCheck()) return
        this.singleBlocks.forEach(element => {
            let x = element.x - this.x
            let z = element.z - this.z
            element.x = this.x + z
            element.z = this.z - x
        })
        this.consoleLog()
    }
    rotateBlockZCheck() {
        let canRotate = true
        this.singleBlocks.forEach(element => {
            if (this.x + element.y - this.y < 0 || this.x + element.y - this.y >= 7) return canRotate = false
            //if (this.y - element.x - this.x) return canRotate = false
        })
        return canRotate
    }
    rotateBlockYCheck() {
        let canRotate = true
        this.singleBlocks.forEach(element => {
            if (this.x + (element.z - this.z) < 0 || this.x + (element.z - this.z) >= 7) return canRotate = false
            if (this.z - (element.x - this.x) < 0 || this.z - (element.x - this.x) >= 7) return canRotate = false
        })
        return canRotate
    }
    moveBlock(moveDirection) {
        switch (moveDirection) {
            case 0:
                this.moveBlocks(0, -1)
                break
            case 1:
                this.moveBlocks(1, 0)
                break
            case 2:
                this.moveBlocks(0, 1)
                break
            case 3:
                this.moveBlocks(-1, 0)
                break
        }
    }
    moveBlocks(xMove, zMove) {
        if (!this.moveBlocksCheck(xMove, zMove)) return
        this.x += xMove
        this.z += zMove
        this.singleBlocks.forEach(block => {
            block.x += xMove
            block.z += zMove
        })
    }
    moveBlocksCheck(xMove, zMove) {
        let canMove = true
        this.singleBlocks.forEach(block => {
            if (block.x + xMove < 0 || block.x + xMove >= 7) return canMove = false
            if (block.z + zMove < 0 || block.z + zMove >= 7) return canMove = false
        })
        return canMove
    }
}