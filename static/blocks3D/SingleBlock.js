class SingleBlock extends THREE.Mesh {
    constructor(x, y, z, color) {
        super()
        this.x = x
        this.y = y
        this.z = z
        this.geometry = this.createrGeometry()
        this.material = new THREE.MeshBasicMaterial({ color: 0x000000 })
        return this
    }
    createrGeometry() {
        let singleGeometry = new THREE.Geometry()

        let cube = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100))
        cube.position.set(0, 50, 0)
        cube.updateMatrix()
        singleGeometry.merge(cube.geometry, cube.matrix)

        return singleGeometry
    }
}