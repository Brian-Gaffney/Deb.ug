import ReactDOM from 'react-dom';
import React from 'react';

import 'styles/global.scss';

import App from './components/app';

let el = document.createElement('div');
el.setAttribute('class', 'app-container');
document.body.appendChild(el);

ReactDOM.render(React.createElement(App), el);