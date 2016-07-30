import hexToRgb from 'hex-rgb';

const colors = {
	text: '#3C3C46',
	primary: '#FFA500',
	secondary: '#6666DD'
};

const rgbHexColors = {};

// Map the hex values to RGB and R, G, B
Object.keys(colors).forEach((key, i) => {
	const hex = colors[key];
	const rgb = hexToRgb(hex);

	// Individual RGB vals
	const [r,g,b] = rgb;

	rgbHexColors[key] = {
		r,
		g,
		b,
		rDecimal: r / 255,
		gDecimal: g / 255,
		bDecimal: b / 255,
		hex,
		rgb: rgb.join(',') // RGB string
	};
});

export default rgbHexColors;