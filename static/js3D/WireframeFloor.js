class WireframeFloor extends THREE.Object3D {
    constructor(w, h, color) {
        super()
        this.w = w
        this.h = h

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

        var linesMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF, opacity: 0.1, transparent: true, linew: 1 });

        var x = -1 * this.h * 100 / 2
        var z = -1 * this.w * 100 / 2
        for (let a = 0; a < this.w + 1; a++) {
            var lineGeometry = new THREE.Geometry()
            lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0))
            lineGeometry.vertices.push(new THREE.Vector3(this.h * 100, 0, 0))

            var lineX = new THREE.Line(lineGeometry, linesMaterial)
            lineX.position.z = z
            lineX.position.x = -1 * this.h * 100 / 2
            this.add(lineX)

            z += 100
            x += 100
        }

        var x = -1 * this.h * 100 / 2
        var z = -1 * this.w * 100 / 2
        for (let b = 0; b < this.h + 1; b++) {
            var lineGeometry = new THREE.Geometry()
            lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
            lineGeometry.vertices.push(new THREE.Vector3(0, 0, this.w * 100));

            var lineZ = new THREE.Line(lineGeometry, linesMaterial)
            lineZ.position.z = -1 * this.w * 100 / 2
            lineZ.position.x = x
            this.add(lineZ)

            z += 100
            x += 100
        }
    }
}