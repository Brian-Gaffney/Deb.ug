import React from 'react';
import ga from 'react-google-analytics';

let GAInitiailizer = ga.Initializer;

const GoogleAnalytics = React.createClass({

	displayName: 'GoogleAnalytics',

	componentDidMount () {
		ga('create', 'UA-32936832-1', 'auto');
		ga('send', 'pageview');
	},

	render () {
		return (
			<GAInitiailizer />
		);
	}
});

export default GoogleAnalytics;