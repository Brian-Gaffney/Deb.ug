import React from 'react';
import Helmet from 'react-helmet';
import injectSheet from 'react-jss'

import colors from 'colors';
import GoogleAnalytics from './GoogleAnalytics';
import GlobalStyles from './GlobalStyles';
import AboutMe from './AboutMe.jsx';
import Technologies from 'components/Technologies';
import { hasWebGl } from 'utils/featureDetection';

const styles = {
	contentWrapper: {
		zIndex: 100,
		position: 'relative',
	},
};

const App = React.createClass({

	displayName: 'App',

	getInitialState () {
		return {
			ThreeDemo: null
		};
	},

	componentDidMount () {
		if (hasWebGl()) {
			this.loadThreeDemo();
		}
	},

	// Load ThreeDemo from a separate bundle
	loadThreeDemo () {
		require.ensure([], () => {
			var ThreeDemo = require('components/ThreeJSDemo').default;

			this.setState({
				ThreeDemo
			});
		});
	},

	renderThreeDemo () {
		if (!this.state.ThreeDemo) {
			return null;
		}

		return <this.state.ThreeDemo />
	},

	render () {
		const ThreeDemo = this.renderThreeDemo();

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
							content: colors.primary.hex
						}
					]}
				/>

				<div className={classes.contentWrapper}>
					<AboutMe />
					<Technologies />
				</div>

				{ ThreeDemo }

				<GoogleAnalytics />
			</div>
		);
	}
});

export default injectSheet(styles)(App)