import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import SceneControls from './components/Controls'
// Systems
import LightMovement from './Systems/LightMovement'
// Models
import ShipGLTF from './assets/models/ship/scene.gltf'
import ShipGLTFbin from './assets/models/ship/scene.bin'
import ShipGLTFtexture from
	'./assets/models/ship/textures/Mesquite3DDM8MF2023_baseColor.jpeg'

console.log(window)
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
			const planeGeometry = new THREE.PlaneGeometry(10, 10, 1, 1)
			const planeMaterial = new THREE.MeshPhongMaterial({
				color: 'green',
			})
			const plane = new THREE.Mesh(planeGeometry, planeMaterial)
			plane.receiveShadow = true
			plane.rotation.x = -0.5 * Math.PI
			
			this.#scene.add(plane)
			
			// light
			const color = 0xFFFFFF
			const intensity = 2
			const light = new THREE.DirectionalLight(color, intensity)
			light.position.set(0, 2, 0)
			light.target.position.set(0, 0, 0)
			light.castShadow = true
			
			console.log(light)
			// this.#scene.add(light);
			// this.#scene.add(light.target);
			// const cameraHelper = new THREE.CameraHelper(light.shadow.camera)
			// this.#scene.add(cameraHelper);
			console.log(this.#renderer.domElement)
			
			// camera
			this._sceneControlsObj = new SceneControls({
				cameraWidth: canvas.width,
				cameraHeight: canvas.height,
				rendererDomElement: this.#renderer.domElement,
			})
			
			this.#camera = this._sceneControlsObj.getCamera()
			// this.#camera.lookAt(10, 10, 10);
			// console.log(this.#camera)			
			// console.log(this.#camera.lookAt)			
			
			// point light
			this._light = new THREE.PointLight('#66CDAA', 5.3, 1.5)
			// const pointLight = new THREE.PointLight('#9ACD32', 5.3, 1.5);
			this._light.castShadow = true
			// pointLight.shadow.bias = -50
			// pointLight.shadow.bias = -5
			// pointLight.shadow.bias = -0.0005
			this._light.shadow.bias = -0.001
			// pointLight.shadow.bias = 0.0001
			// pointLight.shadow.bias = -0.001
			// pointLight.shadow.bias = -50
			this._light.position.set(0, 1.5, 0)
			// pointLight.target.position.set(0, 0, 0);
						
			this.#scene.add(this._light)
			// this.#scene.add(pointLight.target);
			console.log('pointLight', this._light)
			// const plHelper = new THREE.PointLightHelper(this._light)
			// this.#scene.add(plHelper);
			
			this._lightMovementObj = new LightMovement(this._light)
			
			// cube
			const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
			const cubeMaterial = new THREE.MeshPhongMaterial({
				color: 'red',
			})
			
			this._cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
			this._cube.position.set(0, 1, 0)
			this._cube.castShadow = true
			this._cube.receiveShadow = true
			// this.#scene.add(this._cube);
			
			const gltfLoader = new GLTFLoader()
			
			gltfLoader.load(ShipGLTF, (gltf) => {
				const root = gltf.scene
				const rootBin = ShipGLTFbin
				const rootTexture = ShipGLTFtexture
				console.log('root', root)
				root.position.set(0, 1.2, 0)
				// root.rotation.y = (90 * (Math.PI / 180))
				root.scale.set(0.1, 0.1, 0.1)
				// root.forward = new THREE.Vector3(0, 0, 1)
				
				this.#scene.add(root)
			})
			
			this.resume()
			// ------------------------ calculations ------------------------
		}
		
		resume() {
			console.log(this.#renderer)
			// console.log(this.animate)
			// console.log(this.animate.bind(this))
			// this.animate(this.animate.bind(this))
			// this.animate.bind(this)()
			// this.animate()
			this.#renderer.setAnimationLoop(this.animate.bind(this))
		}
		
		animate(time) {
			// const newTime = time *= 0.001
			// this._cube.position.x += 0.0001
			// console.log('newTime', newTime)
			// requestAnimationFrame(this.animate.bind(this));
			// console.log('this._sceneControlsObj', this._sceneControlsObj)
			this._sceneControlsObj.updateSceneCamera()
			this.#renderer.render(this.#scene, this.#camera)
			
			this._lightMovementObj.update()
		}
	}
	
	const game = new Game()
	game.init()
})
