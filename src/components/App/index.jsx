import React from 'react';

import GoogleAnalytics from './components/GoogleAnalytics';
import AboutMe from 'components/content/AboutMe';
import Technologies from 'components/content/Technologies';
import { hasWebGl } from 'utils/featureDetection';

import styles from './styles.scss';

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
			var ThreeDemo = require('components/ThreeDemo').default;

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
			<div className={styles.component}>
				<div className={styles.contentWrapper}>
					<AboutMe />
					<Technologies />
				</div>

				{ ThreeDemo }

				<GoogleAnalytics />
			</div>
		);
	}
});

export default App;