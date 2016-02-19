const getRandom = (min, max) => {
	return Math.random() * (max - min) + min;
};

const getRandomWithBias = (min, max, bias, influence) => {
	let random = Math.random() * (max - min) + min;
	let difference = random - bias;
	let mixer = Math.pow(Math.random(), influence);
	let toBeRemoved = difference * mixer;

	return Math.floor(random - toBeRemoved);
};

const getRandomPointOnSphere = (radius) => {
	// First get a random point along a sphere with set radius
	var u = Math.random();
	var v = Math.random();
	var theta = 2 * Math.PI * u;
	var phi = Math.acos(2 * v - 1);
	var x = (radius * Math.sin(phi) * Math.cos(theta));
	var y = (radius * Math.sin(phi) * Math.sin(theta));
	var z = (radius * Math.cos(phi));

	// Extra randomisation so as to avoid a perfect sphere
	x += getRandom(-(radius / 15), (radius / 15));
	y += getRandom(-(radius / 15), (radius / 15));
	z += getRandom(-(radius / 15), (radius / 15));

	return {
		x,
		y,
		z
	};
};

export {
	getRandom,
	getRandomWithBias,
	getRandomPointOnSphere
}