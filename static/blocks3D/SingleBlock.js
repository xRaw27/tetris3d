class SingleBlock extends THREE.Object3D {
    constructor(x, y, z, color, type = 1) {
        super()
        this.x = x
        this.y = y
        this.z = z
        this.color = color
        this.type = type

        if (this.type == 2) {
            this.add(game.model)
        }
        else {
            this.blockType()
            this.mesh = new THREE.Mesh(this.geometry, this.material)
            this.add(this.mesh)
        }
        return this
    }
    blockType() {
        if (this.type == 0) {
            this.material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, opacity: 0.6, transparent: true })
            this.geometry = this.createrGeometry()
        }
        else if (this.type == 1) {
            this.material = new THREE.MeshPhongMaterial({ color: this.color })
            this.geometry = this.createrGeometry()
        }
    }
    createrGeometry() {
        let singleGeometry = new THREE.Geometry()

        let cube = new THREE.Mesh()

        if (this.type == 0) {
            cube.geometry = new THREE.BoxGeometry(90, 90, 90)
            cube.position.set(0, 45, 0)
        }
        else {
            cube.geometry = new THREE.BoxGeometry(96, 96, 96)
            cube.position.set(0, 48, 0)
        }
        cube.updateMatrix()
        singleGeometry.merge(cube.geometry, cube.matrix)

        return singleGeometry
    }
}