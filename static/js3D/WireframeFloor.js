class WireframeFloor {
    constructor(color, w) {
        this.w = w
        this.color = color
        this.obj3D = new THREE.Object3D()
        this.plane = null
        this.addPlane()
        this.addWireframe()
    }
    addPlane() {
        var planeGeometry = new THREE.PlaneGeometry(this.w * 100, this.w * 100)
        var planeMaterial = new THREE.MeshBasicMaterial({ color: this.color, side: THREE.DoubleSide })
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial)
        this.plane.rotation.x = Math.PI * 3 / 2
        this.obj3D.add(this.plane)
    }
    addWireframe() {
        let x = -1 * this.w * 100 / 2
        let z = -1 * this.w * 100 / 2

        var linesMaterial = new THREE.LineBasicMaterial({ color: 0x00000, opacity: 1, linewidth: 1 });

        for (let a = 0; a < this.w + 1; a++) {
            var lineGeometry = new THREE.Geometry()
            lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
            lineGeometry.vertices.push(new THREE.Vector3(this.w * 100, 0, 0));

            var lineZ = new THREE.Line(lineGeometry, linesMaterial)
            lineZ.position.z = z
            lineZ.position.x = -1 * this.w * 100 / 2
            this.obj3D.add(lineZ)

            var lineGeometry = new THREE.Geometry()
            lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
            lineGeometry.vertices.push(new THREE.Vector3(0, 0, this.w * 100));

            var lineX = new THREE.Line(lineGeometry, linesMaterial)
            lineX.position.x = x
            lineX.position.z = -1 * this.w * 100 / 2

            this.obj3D.add(lineX)

            z += 100
            x += 100
        }

    }
    getObj() {
        return this.obj3D
    }
}