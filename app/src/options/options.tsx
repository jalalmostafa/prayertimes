import '../style/flaticon.css'
import '../style/rc-switch.css'
import './options.css'

import React from 'react'

import { i18n } from '../common/i18n-service'
import { HourFormat } from './hour-format'
import { Location } from './location'
import { Method } from './method'

export class Options extends React.Component {

    constructor(props: {}) {
        super(props)
    }

    render() {
        return (
            <div>
                <div className="header">
                    <span className="header-content">
                        <i className="flaticon-small-mosque flaticon-lg main-icon header-icon" />
                        <h1>{i18n.header}</h1>
                    </span>
                </div>
                <div className="options-container">
                    <div className="options-wrapper">
                        <Location />
                        <Method />
                        <HourFormat />
                    </div>
                </div>
            </div>
        )
    }
}
