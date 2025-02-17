import '../style/flaticon.css'
import '../style/rc-switch.css'
import './options.css'

import React from 'react'

import { i18n } from '../common/i18n-service'
import { AdujstHijriDate } from './adjust-hijri'
import { HourFormat } from './hour-format'
import { Location } from './location'
import { Method } from './method'

export class Options extends React.Component {

    constructor(props: {}) {
        super(props)
    }

    render() {
        const rtl = i18n.isRtl
        return (
            <div className={rtl ? 'rtl-style' : ''}>
                <div className="header">
                    <span className="header-content">
                        <i className="flaticon-small-mosque flaticon-lg main-icon header-icon" />
                        <h1 className={rtl ? 'cairo-style' : 'roboto-style'}>{i18n.header}</h1>
                    </span>
                </div>
                <div className="options-container">
                    <div className={rtl ? 'options-wrapper cairo-style' : 'options-wrapper'}>
                        <Location />
                        <Method />
                        <HourFormat />
                        <AdujstHijriDate />
                    </div>
                </div>
            </div>
        )
    }
}
