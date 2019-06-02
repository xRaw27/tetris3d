class WireframeSide {
    constructor(w, h) {
        this.obj3D = new THREE.Object3D()
        this.w = w
        this.h = h
        this.addWireframe()
    }
    addWireframe() {
        var linesMaterial = new THREE.LineBasicMaterial({ color: 0x00000, opacity: 0.1, transparent: true });

        let x = -1 * this.w * 100 / 2
        for (let a = 0; a < this.w + 1; a++) {

            var lineGeometry = new THREE.Geometry()
            lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
            lineGeometry.vertices.push(new THREE.Vector3(0, this.h * 100, 0));

            var line2 = new THREE.Line(lineGeometry, linesMaterial)
            line2.position.x = x

            this.obj3D.add(line2)

            x += 100
        }

        var y = 0
        for (let b = 0; b < this.h + 1; b++) {
            var lineGeometry = new THREE.Geometry()
            lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
            lineGeometry.vertices.push(new THREE.Vector3(this.w * 100, 0, 0));

            var line = new THREE.Line(lineGeometry, linesMaterial)
            line.position.x = -1 * this.w * 100 / 2
            line.position.y = y
            this.obj3D.add(line)
            y += 100
        }
    }
    getObj() {
        return this.obj3D
    }
}