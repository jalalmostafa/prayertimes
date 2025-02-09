import { library } from '@fortawesome/fontawesome-svg-core'
import { faBell, faCogs } from '@fortawesome/free-solid-svg-icons'
import ReactDOM from 'react-dom/client'

import { PrayerTimesPopup } from './prayer-times-popup'

const container = document.createElement('div')
document.body.appendChild(container)

library.add(faBell, faCogs)

const root = ReactDOM.createRoot(container)
root.render(<PrayerTimesPopup />)
