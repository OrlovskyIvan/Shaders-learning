import * as THREE from 'three'
import sVec3 from '../../helpers/sVec3.js'

export default class PlaneBasic {
	#plane
	
	constructor(
		scene,
		color = 'green',
		position = sVec3(),
		castShadow = true,
		receiveShadow = true,
	) {
		const planeGeometry = new THREE.PlaneGeometry(10, 10, 1, 1)
		const planeMaterial = new THREE.MeshPhongMaterial({
			color,
		})
		this.#plane = new THREE.Mesh(planeGeometry, planeMaterial)
		this.#plane.position.set(...position)
		this.#plane.receiveShadow = receiveShadow
		this.#plane.castShadow = castShadow
		this.#plane.rotation.x = -0.5 * Math.PI
					
		scene.add(this.#plane)
	}
		
	getPlane() {
		return this.#plane
	}
}
