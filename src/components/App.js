import { Component, h } from 'preact'
import Helmet from 'react-helmet'
import injectSheet from 'react-jss'

import { hasWebGl } from '../utils/featureDetection'
import colors from '../colors'

import GoogleAnalytics from './GoogleAnalytics'
import GlobalStyles from './GlobalStyles'
import AboutMe from './AboutMe'
import Technologies from './Technologies'

const styles = {
	contentWrapper: {
		zIndex: 100,
		position: 'relative',
	},
}

class App extends Component {

	constructor () {
		super()

		this.state = {
			ThreeDemo: null,
		}
	}

	componentDidMount () {
		if (hasWebGl()) {
			this.loadThreeDemo()
		}
	}

	// Load ThreeDemo from a separate bundle
	loadThreeDemo () {
		require.ensure([], () => {
			let ThreeDemo = require('./ThreeJSDemo').default

			this.setState({
				ThreeDemo,
			})
		})
	}

	renderThreeDemo () {
		if (!this.state.ThreeDemo) {
			return null
		}

		return <this.state.ThreeDemo />
	}

	render () {
		const ThreeDemo = this.renderThreeDemo()

		const {
			classes,
		} = this.props

		return (
			<div>

				<GlobalStyles />

				<Helmet
					meta={[
						{
							name: 'theme-color',
							content: colors.primary.hex,
						},
					]}
				/>

				<div className={classes.contentWrapper}>
					<AboutMe />
					<Technologies />
				</div>

				{ ThreeDemo }

				<GoogleAnalytics />
			</div>
		)
	}
}

export default injectSheet(styles)(App)