import React from 'react';

import GoogleAnalytics from './components/GoogleAnalytics';
import AboutMe from './components/AboutMe';

const App = React.createClass({

	displayName: 'App',

	render () {
		return (
			<div>
				<GoogleAnalytics />
				<AboutMe />
			</div>
		);
	}
});

export default App;