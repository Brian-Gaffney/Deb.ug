import React from 'react';

const TECHNOLOGIES = [
	'React.js',
	'Backbone.js',
	'Webpack and Gulp',
	'SASS',
	'Linux'
];

export default React.createClass({

	displayName: 'Technologies',

	renderItem (item, index) {
		return <li key={ index }>{ item }</li>;
	},

	render () {
		return (
			<div>
				<h2>
					Technologies I like and use
				</h2>

				<ul>
					{ TECHNOLOGIES.map(this.renderItem) }
				</ul>
			</div>
		);
	}
});