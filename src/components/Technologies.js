import { h } from 'preact'

const technologies = [
	'React and Redux',
	'Mongo and RethinkDB',
	'Node and Express',
	'GraphQL and Apollo',
	'Webpack',
	'PostCSS, SASS, Fela, JSS, CSS modules',
	'Git',
	'Linux',
]

export default () => (
	<div>
		<h2>
			Technologies I like and use
		</h2>

		<ul>
			{ technologies.map((t, index) => (
				<li key={index}>
					{t}
				</li>
			)) }
		</ul>
	</div>
)