import { library } from '@fortawesome/fontawesome-svg-core'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import ReactDOM from 'react-dom'

import { Options } from './options'

const container = document.createElement('div')
document.body.appendChild(container)

library.add(faMapMarkerAlt)

ReactDOM.render(<Options />, container)
