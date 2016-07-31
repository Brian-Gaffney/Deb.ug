import hexToRgb from 'hex-rgb';

const colorVariations = [
	{
		primary: '#FFA500',
		secondary: '#6666DD'
	},
	{
		primary: '#6666DD',
		secondary: '#FFA500'
	},
	{
		primary: '#22dddd',
		secondary: '#CC4477'
	},
	{
		primary: '#DD2222',
		secondary: '#2222DD'
	},
	{
		primary: '#2222DD',
		secondary: '#DD2222'
	}
];

// Get a random variation
const variation = colorVariations[Math.floor(Math.random() * colorVariations.length)];

// Merge defaults with random variation
const colors = {
	text: '#3C3C44',
	...variation
};

const rgbHexColors = {};

/*
 * Map the hex values to:
 * RGB string: eg. 220,110,50
 * Separate R, G and B ints 0-255
 * Separate decimal R G and B values from 0-1
 */
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