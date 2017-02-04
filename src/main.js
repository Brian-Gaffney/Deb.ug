import { h, render } from 'preact'
import favicolor from 'favicolor'

import colors from './colors'
import App from './components/App'

let el = document.createElement('div')
el.setAttribute('class', 'app-container')
document.body.appendChild(el)

render(<App />, el)

const icon = document.querySelector('[rel="shortcut icon"]')
favicolor(icon, colors.primary.hex)