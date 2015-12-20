import React from 'react';

import GoogleAnalytics from './components/GoogleAnalytics';
import AboutMe from 'components/content/AboutMe';
import Technologies from 'components/content/Technologies';

const App = React.createClass({

	displayName: 'App',

	render () {
		return (
			<div>
				<GoogleAnalytics />
				<AboutMe />
				<Technologies />
			</div>
		);
	}
});

export default App;