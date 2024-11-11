import * as THREE from 'three'
import sVec3 from '../../helpers/sVec3.js'

export default class CubeBasic {
	#cube
	
	constructor(
		scene,
		color = 'red',
		position = sVec3(),
		castShadow = true,
		receiveShadow = true,
	) {
		const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
		const cubeMaterial = new THREE.MeshPhongMaterial({
			color,
		})
		
		this.#cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
		this.#cube.position.set(...position)
		this.#cube.castShadow = castShadow
		this.#cube.receiveShadow = receiveShadow
			
		scene.add(this.#cube)
	}
		
	getCube() {
		return this.#cube
	}
}
