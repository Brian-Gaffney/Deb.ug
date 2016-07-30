import React from 'react';
import Radium, { Style } from 'radium';
import background from './bg.png';

const colours = {
	primary: {
		hex: '#FFA500',
		rgb: '255,165,0'
	}
}

const globalStyles = {
	body: {
		height: '100%',
		background: 'lightgrey',
		color: 'rgb(60, 60, 70)',
		padding: '1% 4%',

		fontFamily: "'Open Sans', Verdana, Geneva, sans-serif",
		fontStyle: 'normal',

		// Background tile from: http://subtlepatterns.com
		backgroundImage: `url(${background})`,
		backgroundSize: 'auto',
		backgroundRepeat: 'repeat repeat',

		':hover': {
			background: 'red'
		}
	},

	a: {
		color: 'rgb(100,100,100)',
		padding: '5px 8px',

		transition: 'color 0.5s ease-in, background-color 0.5s ease-out',
		borderRadius: '2px'
	},

	'a:hover': {
		color: '#0166FF',
		backgroundColor: `rgba(${colours.primary.rgb}, 0.8)`
	},

	h1: {
		fontWeight: 700,
		fontSize: '3rem'
	},

	h2: {
		fontWeight: 500,
		fontSize: '2.2rem'
	},

	p: {
		fontSize: '1.5rem'
	},

	ul: {
		listStyleType: 'circle',
		fontSize: '1.4rem',
		paddingLeft: '3em'
	},

	'ul li': {
		marginBottom: '0.4em',

		'@media screen and (max-width: 700px)': {
			marginBottom: '0.8em'
		}
	}
};

const GlobalStyles = React.createClass({
	displayName: 'GlobalStyles',

	render () {
		return (
			<Style
				rules={globalStyles}
			/>
		);
	}
});

export default Radium(GlobalStyles);