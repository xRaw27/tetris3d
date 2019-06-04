class Game {
    constructor() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(45, $(window).width() / $(window).height(), 0.4, 10000)

        this.renderer.setClearColor(0xffffff)
        this.renderer.shadowMap.enable = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

        this.camera.position.set(0, 3000, -1000)
        this.camera.lookAt(this.scene.position)

        this.activeBlock = null

        //this.init()
    }

    init() {
        this.renderer.setSize($(window).width(), $(window).height())
        $("#root").append(this.renderer.domElement)

        this.addAxes()
        this.addOrbitControls()
        // this.addElems()
        // this.createBoxFloor()
        this.addAmbientLight()
        this.createWireframe()
        // this.addResizeListener()
        this.render()
        //this.addBlock()
        this.keyboardControls()
    }

    addBlock(blockData) {
        let block = new Block(blockData)
        this.setBlockPosition(block)
        console.log(block)
        this.activeBlock = block
        this.scene.add(block)
    }
    updateBlock(blockData) {
        this.activeBlock.updateBlock(blockData)
        this.setBlockPosition(this.activeBlock)
        console.log(Date.now())
    }

    blockFall() {
        this.activeBlock.blockFall()
        this.setBlockPosition(this.activeBlock)
    }

    setBlockPosition(block) {
        block.singleBlocks.forEach(singleBlock => {
            singleBlock.position.set((singleBlock.x - 3) * 100, singleBlock.y * 100, (singleBlock.z - 3) * 100)
        })
    }

    moveBlock(direction) {
        if (this.activeBlock == null) return
        console.log('he?')
        net.moveBlock(direction)
        //this.setBlockPosition(this.activeBlock)
        //console.log(this.activeBlock.singleBlocks)
    }

    rotateBlockZ() {
        if (this.activeBlock == null) return
        net.rotateBlockZ()
    }

    rotateBlockY() {
        if (this.activeBlock == null) return
        net.rotateBlockY()
    }

    keyboardControls() {
        $(document).keydown(event => {
            console.log(Date.now())
            switch (event.keyCode) {
                case 40: // down
                    this.moveBlock(0)
                    break
                case 37: // left
                    this.moveBlock(1)
                    break
                case 38: // up
                    this.moveBlock(2)
                    break
                case 39: // right
                    this.moveBlock(3)
                    break
                case 90: // z
                    this.rotateBlockZ()
                    break
                case 88: // x
                    this.rotateBlockY()
                    break
            }
        })
    }


    createWireframe() {
        var floor = new WireframeFloor(0xff0000, 7)
        this.scene.add(floor.getObj())
        var ang = 0
        var posArray = [
            { x: 0, z: -350 },
            { x: -350, z: 0 },
            { x: 0, z: 350 },
            { x: 350, z: 0 },
        ]
        for (var i = 0; i < 4; i++) {
            var side = new WireframeSide(7, 15)
            side.getObj().position.z = posArray[i].z
            side.getObj().position.x = posArray[i].x
            side.getObj().rotation.y = ang
            this.scene.add(side.getObj())
            ang += Math.PI / 2
        }
    }

    addAmbientLight() {
        var ambientLight = new THREE.AmbientLight(0xffffff, 1)
        ambientLight.castShadow = true
        this.scene.add(ambientLight)
    }

    render() {
        requestAnimationFrame(this.render.bind(this))
        this.renderer.render(this.scene, this.camera)
    }

    addAxes() {
        this.axes = new THREE.AxesHelper(1000)
        this.scene.add(this.axes)
    }

    addOrbitControls() {
        let orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
        orbitControls.noKeys = true
    }

    addResizeListener() {
        $(window).on('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
        })
    }
}