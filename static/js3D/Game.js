class Game {
    constructor() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(45, $(window).width() / $(window).height(), 0.4, 5000)

        this.renderer.setClearColor(0xffffff)
        this.renderer.shadowMap.enable = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderer.setSize($(window).width(), $(window).height())
        $("#root").append(this.renderer.domElement)

        this.camera.position.set(600, 600, 600)
        this.camera.lookAt(this.scene.position)

        let testGeometry = new THREE.BoxGeometry(300, 700, 300)
        let testMaterial = new THREE.MeshNormalMaterial()
        let test = new THREE.Mesh(testGeometry, testMaterial)
        // this.scene.add(test)
        this.addAxes()
        this.addOrbitControls()
        this.addElems()
        this.addAmbientLight()

        this.render()

    }
    addElems() {
        var con = new THREE.Object3D()

        // var positions = [
        //     new THREE.Vector3(-350, 0, -350),
        //     new THREE.Vector3(-350, 0, 350),
        //     new THREE.Vector3(350, 0, -350),
        //     new THREE.Vector3(350, 0, 350),
        // ]

        // for (let vect of positions) {
        //     var geometry = new THREE.Geometry()
        //     geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        //     geometry.vertices.push(new THREE.Vector3(0, 1200, 0));

        //     var linesMaterial = new THREE.LineBasicMaterial({ color: 0x00000, opacity: .2, linewidth: .2 });

        //     var line = new THREE.Line(geometry, linesMaterial)
        //     console.log(vect)
        //     line.position.set(vect.x, vect.y, vect.z)
        //     this.scene.add(line)
        // }
        var geometry = new THREE.BoxBufferGeometry(100, 100, 100);
        var edges = new THREE.EdgesGeometry(geometry);
        var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
        var material = new THREE.MeshPhongMaterial({
            color: 0xff0000,
        })
        var cube = new THREE.Mesh(geometry, material)
        cube.add(line)
        this.scene.add(cube)

        // this.addCube()

    }

    addCube() {
        var geometry = new THREE.BoxGeometry(100, 100, 100)
        var material = new THREE.MeshPhongMaterial({
            color: 0xff0000,
        })
        var cube = new THREE.Mesh(geometry, material)
        cube.position.set(0, 50, 0)
        this.scene.add(cube)
    }

    addAmbientLight() {
        var ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
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
        this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
        this.orbitControls.addEventListener('change', () => {
            this.renderer.render(this.scene, this.camera)
        })
    }
}