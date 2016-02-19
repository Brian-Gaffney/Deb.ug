import React from 'react';

import GoogleAnalytics from './components/GoogleAnalytics';
import AboutMe from 'components/content/AboutMe';
import Technologies from 'components/content/Technologies';
import ThreeDemo from 'components/ThreeDemo';

import styles from './styles.scss';

const App = React.createClass({

	displayName: 'App',

	render () {
		return (
			<div className={styles.component}>
				<ThreeDemo />
				<GoogleAnalytics />
				<AboutMe />
				<Technologies />
			</div>
		);
	}
});

export default App;