import * as THREE from 'three'
import CameraControls from 'camera-controls'

export default class SceneCamera {
	#camera
	
	constructor({ cameraWidth, cameraHeight, rendererDomElement }) {
		this._clock = new THREE.Clock()
		
		CameraControls.install({ THREE })
			
		this.#camera = new THREE.PerspectiveCamera(
			75,
			cameraWidth / cameraHeight,
			0.1,
			1000,
		)
			
		this.#camera.position.set(2, 3.5, 2.5)
			
		this._cameraControls = new CameraControls(this.#camera, rendererDomElement)
			
		this._cameraControls.setTarget(2, 0, 0)
			
		this._cameraControls.azimuthRotateSpeed = 0.1 // Дефолтное значение: 1.0
		this._cameraControls.polarRotateSpeed = 0.1 // Дефолтное значение: 1.0
		this._cameraControls.dollySpeed = 0.1 // Дефолтное значение: 1.0
		this._cameraControls.truckSpeed = 0.1 // Дефолтное значение: 2.0
	}
		
	updateSceneCamera() {
		const delta = this._clock.getDelta()
		
		this._cameraControls.update(delta)
	}
	
	getCamera() {
		return this.#camera
	}
}
