class Game {
    constructor() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.sortObjects = false
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(45, $(window).width() / $(window).height(), 0.4, 10000)

        this.renderer.shadowMap.enable = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

        this.camera.position.set(0, 3000, -1000)
        this.camera.lookAt(0, 3000, 0)

        this.activeBlock = null
        this.staticBlocks = []
        this.model = null



        //this.init()
    }

    init() {
        this.renderer.setSize($(window).width(), $(window).height())
        $("#root").append(this.renderer.domElement)

        // this.stats = new Stats()
        // this.stats.showPanel(0)
        // $('body').append(this.stats.dom)

        this.loadModel()
        //this.addAxes()
        this.addOrbitControls()
        // this.addElems()
        // this.createBoxFloor()
        this.addAmbientLight()
        this.createWireframe(4, 14)
        this.staticBlocksInit()
        // this.addResizeListener()
        this.render()
        //this.addBlock()
        this.keyboardControls()
    }

    loadModel() {
        let loader = new THREE.GLTFLoader();
        loader.load('/models/tnt_3d/scene.gltf', gltf => {
            gltf.scene.scale.set(5, 5, 5)
            let center = new THREE.Vector3(0, 0, 0)
            new THREE.Box3().setFromObject(gltf.scene).getCenter(center)
            gltf.scene.position.sub(center)
            gltf.scene.position.y += 50

            this.model = gltf.scene
        })
    }

    addBlock(data) {
        let block = new Block(data.block, data.color, data.type)
        this.setBlockPosition(block)
        console.log(block)
        this.activeBlock = block
        this.scene.add(block)
    }

    updateBlock(data) {
        this.activeBlock.updateBlock(data.block)
        this.setBlockPosition(this.activeBlock)
        //console.log(Date.now())
    }

    staticBlocksInit() {
        this.staticBlocks = []
        for (let x = 0; x < 14; x++) { //14
            this.staticBlocks.push([])
            for (let y = 0; y < 13; y++) {
                this.staticBlocks[x].push([])
                for (let z = 0; z < 4; z++) {
                    this.staticBlocks[x][y].push(0)
                }
            }
        }
    }

    staticBlocksUpdate(data) {
        this.activeBlock.deleteBlock()
        this.activeBlock = null
        console.log(data)
        for (let x = 0; x < 14; x++) { //14
            for (let y = 0; y < 13; y++) {
                for (let z = 0; z < 4; z++) {
                    if (data.blocks[x][y][z].block == 0 && this.staticBlocks[x][y][z] != 0) {
                        console.log("USUWAM!!!")
                        this.scene.remove(this.staticBlocks[x][y][z])
                        this.staticBlocks[x][y][z].geometry.dispose()
                        this.staticBlocks[x][y][z].material.dispose()
                        this.staticBlocks[x][y][z] = 0
                    }
                    if (data.blocks[x][y][z].block != 0 && this.staticBlocks[x][y][z] == 0) this.addStaticBlock(x, y, z, data.blocks[x][y][z].color)
                }
            }
        }
        console.log(data)
    }

    addStaticBlock(x, y, z, color) {
        //console.log("DODAJE BLOK STATYSTYCZNY")
        let staticBlock = new SingleBlock(x, y, z, color)
        this.staticBlocks[x][y][z] = staticBlock
        this.scene.add(staticBlock)
        staticBlock.position.set((staticBlock.x - 7) * 100 + 50, staticBlock.y * 100, (staticBlock.z - 2) * 100 + 50)
    }

    setBlockPosition(block, shadow = false) {
        if (shadow) {
            block.shadowBlocks.forEach(singleBlock => {
                singleBlock.position.set((singleBlock.x - 7) * 100 + 50, singleBlock.y * 100, (singleBlock.z - 2) * 100 + 50)
            })
        }
        else {
            block.singleBlocks.forEach(singleBlock => {
                singleBlock.position.set((singleBlock.x - 7) * 100 + 50, singleBlock.y * 100, (singleBlock.z - 2) * 100 + 50)
            })
        }
    }

    moveBlock(direction) {
        if (this.activeBlock == null) return
        //console.log('he?')
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
        $(document).on('keydown', event => {
            //console.log(Date.now())
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

    createWireframe(floorWidth, floorHeight) {

        var floor = new WireframeFloor(floorWidth, floorHeight, 0xff0000)
        this.scene.add(floor)

        var sideB = new WireframeSide(14, 12)
        sideB.position.x = 0
        sideB.position.z = 100 * floorWidth / 2
        this.scene.add(sideB)

        var sideR = new WireframeSide(4, 12)
        sideR.position.x = - 100 * floorHeight / 2
        sideR.position.z = 0
        sideR.rotation.y = Math.PI / 2
        this.scene.add(sideR)

        var sideL = new WireframeSide(4, 12)
        sideL.position.x = 100 * floorHeight / 2
        sideL.position.z = 0
        sideL.rotation.y = Math.PI / 2
        this.scene.add(sideL)
    }

    addAmbientLight() {
        let light = new THREE.AmbientLight(0x999999)
        this.scene.add(light)
        let directionalLight = new THREE.DirectionalLight(0xffffff, 0.7)
        directionalLight.position.set(-6, 3, -8)
        this.scene.add(directionalLight)

        // let directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.7)
        // directionalLight2.position.set(5, 2, 5)
        // this.scene.add(directionalLight2)

        // var light = new THREE.DirectionalLight(0xffffff, 0.4)
        // light.position.set(0, 1, -1)
        // light.castShadow = true
        // this.scene.add(light);

        // var light = new THREE.DirectionalLight(0xffffff, 0.6)
        // light.position.set(0, 1, 1)
        // light.castShadow = true
        // this.scene.add(light);
        // var light = new THREE.DirectionalLight(0xffffff, 0.8)
        // light.position.set(1, 1, 0)
        // light.castShadow = true
        // this.scene.add(light);

        // var light = new THREE.DirectionalLight(0xffffff, 0.5)
        // light.position.set(-1, 1, 0)
        // light.castShadow = true
        // this.scene.add(light);
    }

    render() {
        //this.stats.begin()
        requestAnimationFrame(this.render.bind(this))
        this.renderer.render(this.scene, this.camera)
        //this.stats.end()
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
    reset() {
        for (let i = this.scene.children.length - 1; i >= 0; i--) {
            const object = this.scene.children[i];
            if (object.type === 'Mesh') {
                object.geometry.dispose();
                object.material.dispose();
                this.scene.remove(object);
            }
        }

        $("#root").empty()

        $(document).off('keydown')

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.sortObjects = false
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(45, $(window).width() / $(window).height(), 0.4, 10000)

        this.renderer.shadowMap.enable = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

        this.camera.position.set(0, 3000, -1000)
        this.camera.lookAt(this.scene.position)

        this.activeBlock = null
        this.staticBlocks = []
        this.model = null
    }
}