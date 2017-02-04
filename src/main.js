import ReactDOM from 'react-dom';
import React from 'react';
import favicolor from 'favicolor';

import colors from './colors';
import App from './components/App';

let el = document.createElement('div');
el.setAttribute('class', 'app-container');
document.body.appendChild(el);

ReactDOM.render(React.createElement(App), el);

const icon = document.querySelector('[rel="shortcut icon"]');
favicolor(icon, colors.primary.hex);