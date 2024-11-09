export default class LightMovement {
	_light
	_pos = 0
	_movingForward = true
	_step = 0.0015
	
	constructor(light) {
		this._light = light
	}
		
	#moveLight() {
		if (this._movingForward && this._pos < 1) {
			this._pos += this._step
			
			if (this._pos > 1) {
				this._movingForward = false
			}	
		} else {
			this._pos -= this._step
			
			if (this._pos < 0) {
				this._movingForward = true
			}	
		}
		
		this._light.position.set(this._pos * 6, 1.5, Math.sin(2 * Math.PI * this._pos))
	}
	
	update() {
		this.#moveLight()
	}
}
