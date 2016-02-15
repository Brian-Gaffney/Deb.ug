import React from 'react';

import GoogleAnalytics from './components/GoogleAnalytics';
import AboutMe from 'components/content/AboutMe';
import Technologies from 'components/content/Technologies';
import ThreeDemo from 'components/ThreeDemo';

const App = React.createClass({

	displayName: 'App',

	render () {
		return (
			<div>
				<GoogleAnalytics />
				<AboutMe />
				<Technologies />
				<ThreeDemo />
			</div>
		);
	}
});

export default App;