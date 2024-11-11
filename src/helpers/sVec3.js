const sVec3 = (x = 0, y = 0, z = 0) => {
	const obj = Object.create(null)
	obj.x = x
	obj.y = y
	obj.z = z

	obj[Symbol.iterator] = function* () {
		yield this.x
		yield this.y
		yield this.z
	}

	return obj
}

export default sVec3
