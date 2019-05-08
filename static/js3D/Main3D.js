$(document).ready(() => {
    let renderer = new THREE.WebGLRenderer({ antialias: true })
    let scene = new THREE.Scene()
    let camera = new THREE.PerspectiveCamera(45, $(window).width() / $(window).height(), 0.4, 5000)
    let axes = new THREE.AxesHelper(1000)

    renderer.setClearColor(0xffffff)
    renderer.shadowMap.enable = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    renderer.setSize($(window).width(), $(window).height())
    $("#root").append(renderer.domElement)

    scene.add(axes)

    camera.position.set(-1, 600, 0)
    camera.lookAt(scene.position)

    let orbitControl = new THREE.OrbitControls(camera, renderer.domElement)
    orbitControl.addEventListener('change', function () {
        renderer.render(scene, camera)
    })

    let testGeometry = new THREE.BoxGeometry(50, 50, 200)
    let testMaterial = new THREE.MeshNormalMaterial()
    let test = new THREE.Mesh(testGeometry, testMaterial)
    scene.add(test)

    function render() {
        requestAnimationFrame(render)
        renderer.render(scene, camera)
    }
    render()
})