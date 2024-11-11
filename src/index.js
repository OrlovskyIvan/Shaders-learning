import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import SceneControls from './components/Controls'
// Systems
import LightMovement from './Systems/LightMovement'
// Models
import ShipGLTF from './assets/models/ship/scene.gltf'
import ShipGLTFbin from './assets/models/ship/scene.bin'
import ShipGLTFtexture0 from
	'./assets/models/ship/textures/material0_baseColor.jpeg'
import ShipGLTFtexture1 from
	'./assets/models/ship/textures/material1_baseColor.jpeg'
import ShipGLTFtexture2 from
	'./assets/models/ship/textures/material2_baseColor.jpeg'
// basic components
import CubeBasic from './components/basic/CubeBasic'
import PlaneBasic from './components/basic/PlaneBasic'
import LightBasic from './components/basic/LightBasic'
// helpers
import sVec3 from './helpers/sVec3'
// css
import './assets/css/normalize.css'

window.addEventListener('load', () => {
	class Game {
		_cube
		_light
		_lightMovementObj
		
		#canvas
		#canvasWidth = 1600
		#canvasHeight = 900
		#scene
		#camera
		#renderer
				
		init() {
			// canvas
			const canvas = document.getElementById('canvas')
			console.log(canvas)
			canvas.width = this.#canvasWidth
			canvas.height = this.#canvasHeight
			this.#canvas = canvas	
			
			// scene
			this.#scene = new THREE.Scene()
			
			// rendered
			this.#renderer = new THREE.WebGLRenderer({ canvas: this.#canvas })
			this.#renderer.shadowMap.enabled = true	
			
			// plane
			// const plane = new PlaneBasic(this.#scene)
			
			// light
			// const light = new LightBasic(this.#scene, undefined, undefined, sVec3(0, 2, 0))
			
			// camera
			this._sceneControlsObj = new SceneControls({
				cameraWidth: canvas.width,
				cameraHeight: canvas.height,
				rendererDomElement: this.#renderer.domElement,
			})
			
			this.#camera = this._sceneControlsObj.getCamera()
			
			// spotlight
			this._light = new THREE.SpotLight('#66CDAA', 170, 3, 63.3)
			
			this._light.castShadow = true
			this._light.shadow.bias = -0.001
			this._light.position.set(0, 2, 0)
						
			this.#scene.add(this._light)
			
			const pointLightTarget = new THREE.Object3D()
			this.#scene.add(pointLightTarget)
			this._light.target = pointLightTarget
			this._light.target.position.set(5, 0, 0)
			
			this._lightMovementObj = new LightMovement(this._light)
			
			// cube
			// const cube = new CubeBasic(this.#scene)
			
			// ship
			const gltfLoader = new GLTFLoader()
			
			gltfLoader.load(ShipGLTF, (gltf) => {
				const root = gltf.scene
				const rootBin = ShipGLTFbin
				const rootTexture = ShipGLTFtexture0
				const rootTexture2 = ShipGLTFtexture1
				const rootTexture3 = ShipGLTFtexture2
				
				console.log('root', root)
				root.position.set(0, 1.2, -1.10)
				root.scale.set(0.15, 0.15, 0.15)
				
				this.#scene.add(root)
			})
			
			this.resume()
			// ------------------------ calculations ------------------------
		}
		
		resume() {
			console.log(this.#renderer)
			// console.log(this.animate)
			this.#renderer.setAnimationLoop(this.animate.bind(this))
		}
		
		animate(time) {
			this.#renderer.render(this.#scene, this.#camera)
			
			// const newTime = time *= 0.001
			
			// console.log('this._sceneControlsObj', this._sceneControlsObj)
			
			this._sceneControlsObj.updateSceneCamera()
			this._lightMovementObj.update()
		}
	}
	
	const game = new Game()
	game.init()
})
