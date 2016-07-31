import React from 'react';
import { StyleRoot } from 'radium';
import Helmet from 'react-helmet';

import GoogleAnalytics from './GoogleAnalytics';
import GlobalStyles from './GlobalStyles';
import AboutMe from 'components/AboutMe';
import Technologies from 'components/Technologies';
import { hasWebGl } from 'utils/featureDetection';
import colors from 'colors';

const styles = {
	contentWrapper: {
		zIndex: 100,
		position: 'relative'
	}
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
		let ThreeDemo = this.renderThreeDemo();

		return (
			<StyleRoot>

				<Helmet
					meta={[
						{
							name: 'theme-color',
							content: colors.primary.hex
						}
					]}
				/>

				<GlobalStyles />

				<div style={styles.contentWrapper}>
					<AboutMe />
					<Technologies />
				</div>

				{ ThreeDemo }

				<GoogleAnalytics />
			</StyleRoot>
		);
	}
});

export default App;