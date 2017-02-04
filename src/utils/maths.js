const getRandom = (min, max) => {
	return Math.floor(Math.random() * (max - min) + min)
}

const getRandomPointOnSphere = radius => {
	// First get a random point along a sphere with set radius
	let u = Math.random()
	let v = Math.random()
	let theta = 2 * Math.PI * u
	let phi = Math.acos(2 * v - 1)
	let x = (radius * Math.sin(phi) * Math.cos(theta))
	let y = (radius * Math.sin(phi) * Math.sin(theta))
	let z = (radius * Math.cos(phi))

	// Then add randomisation so as to avoid a perfect sphere
	x += getRandom(-(radius / 15), (radius / 15))
	y += getRandom(-(radius / 15), (radius / 15))
	z += getRandom(-(radius / 15), (radius / 15))

	return {
		x,
		y,
		z,
	}
}

export {
	getRandom,
	getRandomPointOnSphere,
}