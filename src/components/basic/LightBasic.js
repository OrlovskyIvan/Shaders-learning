import * as THREE from 'three'
import sVec3 from '../../helpers/sVec3.js'

export default class LightBasic {
	#light
	
	constructor(
		scene,
		intensity = 2,
		color = 'white',
		position = sVec3(),
		castShadow = true,
	) {
		this.#light = new THREE.DirectionalLight(color, intensity)
		this.#light.position.set(...position)
		this.#light.castShadow = castShadow
					
		scene.add(this.#light)
	}
		
	getLight() {
		return this.#light
	}
}
