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
		primary: '#8822BB',
		secondary: '#FAF750'
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

const variation = colorVariations[Math.floor(Math.random() * colorVariations.length)];

const colors = {
	text: '#3C3C44',
	...variation
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