import React from 'react';

const TECHNOLOGIES = [
	'React and Redux',
	'MongoDB',
	'Node',
	'Express',
	'Webpack and Gulp',
	'PostCSS and SASS',
	'Git',
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