var Materials = {
    aquaSide: new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load("/textures/aqua_block.png")
    }),
    blueSide: new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load("/textures/blue_block.png")
    }),
    greenSide: new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load("/textures/green_block.png")
    }),
    orangeSide: new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load("/textures/orange_block.png")
    }),
    redSide: new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load("/textures/red_block.png")
    }),
    yellowSide: new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load("/textures/yellow_block.png")
    }),
}