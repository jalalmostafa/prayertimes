import { library } from '@fortawesome/fontawesome-svg-core'
import { faBell, faCogs } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import ReactDOM from 'react-dom'

import { PrayerTimesPopup } from './prayer-times-popup'

const container = document.createElement('div')
document.body.appendChild(container)

library.add(faBell, faCogs)

ReactDOM.render(<PrayerTimesPopup />, container)
