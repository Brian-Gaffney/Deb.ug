import React from 'react';

import GoogleAnalytics from './components/GoogleAnalytics';
import AboutMe from 'components/content/AboutMe';
import Technologies from 'components/content/Technologies';

import styles from './styles.scss';

const App = React.createClass({

	displayName: 'App',

	getInitialState () {
		return {
			ThreeDemo: null
		};
	},

	componentDidMount () {
		// Load ThreeDemo in a separate bundle
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
				{ ThreeDemo }
				<GoogleAnalytics />
				<AboutMe />
				<Technologies />
			</div>
		);
	}
});

export default App;