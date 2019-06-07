module.exports = class Block {
    constructor(x, y, z, shape, color, type = 1) {
        this.x = x
        this.y = y
        this.z = z
        this.type = type
        this.shape = shape
        this.color = color
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
        //this.consoleLog()
    }
    fall(staticBlocks) {
        if (!this.fallCheck(staticBlocks)) {
            console.log("STOP!!!!")
            return false
        }
        this.y -= 1
        this.singleBlocks.forEach(element => {
            element.y -= 1
        })
        //this.consoleLog()
        return true
    }
    fallCheck(staticBlocks) {
        let canFall = true
        this.singleBlocks.forEach(element => {
            if (element.y - 1 < 0) return canFall = false
            if (element.y < 13) {
                if (staticBlocks[element.x][element.y - 1][element.z].block > 0) return canFall = false
            }
        })
        return canFall
    }
    rotateBlockZ(staticBlocks) {
        if (!this.rotateBlockZCheck(staticBlocks)) return
        this.singleBlocks.forEach(element => {
            let x = element.x - this.x
            let y = element.y - this.y
            element.x = this.x + y
            element.y = this.y - x
        })
        this.consoleLog()
    }
    rotateBlockY(staticBlocks) {
        if (!this.rotateBlockYCheck(staticBlocks)) return
        this.singleBlocks.forEach(element => {
            let x = element.x - this.x
            let z = element.z - this.z
            element.x = this.x + z
            element.z = this.z - x
        })
        this.consoleLog()
    }
    rotateBlockZCheck(staticBlocks) {
        let canRotate = true
        this.singleBlocks.forEach(element => {
            if (this.x + element.y - this.y < 0 || this.x + element.y - this.y >= 14) return canRotate = false
            if (this.y - (element.x - this.x) < 0) return canRotate = false
            if (this.y - (element.x - this.x) < 13) {
                if (staticBlocks[this.x + element.y - this.y][this.y - (element.x - this.x)][element.z].block > 0) return canRotate = false
            }
        })
        return canRotate
    }
    rotateBlockYCheck(staticBlocks) {
        let canRotate = true
        this.singleBlocks.forEach(element => {
            if (this.x + (element.z - this.z) < 0 || this.x + (element.z - this.z) >= 14) return canRotate = false
            if (this.z - (element.x - this.x) < 0 || this.z - (element.x - this.x) >= 4) return canRotate = false
            if (element.y < 13) {
                if (staticBlocks[this.x + (element.z - this.z)][element.y][this.z - (element.x - this.x)].block > 0) return canRotate = false
            }
        })
        return canRotate
    }
    moveBlock(moveDirection, staticBlocks) {
        switch (moveDirection) {
            case 0:
                this.moveBlocks(0, -1, staticBlocks)
                break
            case 1:
                this.moveBlocks(1, 0, staticBlocks)
                break
            case 2:
                this.moveBlocks(0, 1, staticBlocks)
                break
            case 3:
                this.moveBlocks(-1, 0, staticBlocks)
                break
        }
    }
    moveBlocks(xMove, zMove, staticBlocks) {
        if (!this.moveBlocksCheck(xMove, zMove, staticBlocks)) return
        this.x += xMove
        this.z += zMove
        this.singleBlocks.forEach(block => {
            block.x += xMove
            block.z += zMove
        })
    }
    moveBlocksCheck(xMove, zMove, staticBlocks) {
        let canMove = true
        this.singleBlocks.forEach(block => {
            if (block.x + xMove < 0 || block.x + xMove >= 14) return canMove = false //14
            if (block.z + zMove < 0 || block.z + zMove >= 4) return canMove = false
            if (block.y < 13) {
                if (staticBlocks[block.x + xMove][block.y][block.z + zMove].block > 0) return canMove = false
            }
        })
        return canMove
    }
}