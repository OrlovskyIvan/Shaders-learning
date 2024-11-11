export default class LightMovement {
	_light
	// _pos = 0
	_pos = -0.5
	_movingForward = true
	_step = 0.0015
	// _step = 0.015
	
	constructor(light) {
		this._light = light
	}
		
	#moveLight() {
		if (this._movingForward && this._pos < 0.5) {
			this._pos += this._step
			
			if (this._pos > 0.5) {
				this._movingForward = false
			}	
		} else {
			this._pos -= this._step
			
			if (this._pos < -0.5) {
				this._movingForward = true
			}	
		}
		
		this._light.position.set(this._pos * 6, 1.5, Math.sin(8 * this._pos))
	}
	
	update() {
		this.#moveLight()
	}
}
