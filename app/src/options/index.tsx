import { library } from '@fortawesome/fontawesome-svg-core'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import ReactDOM from 'react-dom/client'

import { Options } from './options'

const container = document.createElement('div')
document.body.appendChild(container)

library.add(faMapMarkerAlt)

const root = ReactDOM.createRoot(container)
root.render(<Options />)
