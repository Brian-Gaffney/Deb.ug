import injectSheet from 'react-jss'

import colors from '../colors'

import background from './bg.png'

const styles = {
	'@global': {
		body: {
			height: '100%',
			background: 'lightgrey',
			color: colors.text.hex,
			padding: '1% 4%',

			fontFamily: '\'Open Sans\', Verdana, Geneva, sans-serif',
			fontStyle: 'normal',

			// Background tile from: http://subtlepatterns.com
			backgroundImage: `url(${background})`,
			backgroundSize: 'auto',
			backgroundRepeat: 'repeat repeat',
		},

		a: {
			color: colors.text.hex,
			padding: '5px 8px',

			transition: 'color 0.5s ease-in, background-color 0.5s ease-out',
			borderRadius: '2px',
		},

		'a:hover': {
			color: colors.secondary.hex,
			backgroundColor: `rgba(${colors.primary.rgb}, 0.8)`,
		},

		h1: {
			fontWeight: 700,
			fontSize: '3rem',
		},

		h2: {
			fontWeight: 500,
			fontSize: '2.2rem',
		},

		p: {
			fontSize: '1.5rem',
		},

		ul: {
			listStyleType: 'circle',
			fontSize: '1.4rem',
			paddingLeft: '3em',
		},

		'ul li': {
			marginBottom: '0.5em',

			'@media screen and (max-width: 700px)': {
				marginBottom: '0.8em',
			},
		},
	},
}

// Slight hack, this component doesn't do anything,
// just a noop that can be wrapped with the JSS HoC
const GlobalStyles = () => null

export default injectSheet(styles)(GlobalStyles)