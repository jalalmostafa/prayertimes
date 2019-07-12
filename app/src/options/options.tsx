import '../style/flaticon.css'
import '../style/rc-switch.css'
import './options.css'

import * as React from 'react'

import { i18n } from '../common/i18n-service'
import { MethodType } from '../common/prayer-times'
import { store } from '../common/store'
import { HourFormat } from './hour-format'
import { Method } from './method'

interface IOptionsState {
    method: MethodType
    format: boolean
}

export class Options extends React.Component<{}, IOptionsState> {

    constructor(props: {}) {
        super(props)
        this.state = {
            format: store.defaultFormat,
            method: store.defaultMethod,
        }
        this.loadPage()
    }

    onMethodChange = async (method: MethodType) => {
        this.setState({
            method,
        })
    }
    onFormatChange = (format: boolean) => {
        this.setState({
            format,
        })
    }

    render() {
        return (
            <div>
                <div className="header">
                    <span className="header-content">
                        <i className="flaticon-small-mosque flaticon-lg main-icon header-icon" />
                        <h1>{i18n.header.title}</h1>
                    </span>
                </div>
                <div className="options-container">
                    <div>
                        <Method value={this.state.method} onChange={this.onMethodChange} />
                        <HourFormat value={this.state.format} onChange={this.onFormatChange} />
                    </div>
                </div>
            </div>
        )
    }

    private async loadPage() {
        const method = (await store.method() || store.defaultMethod) as MethodType
        const format = await store.hourFormat() || store.defaultFormat
        this.setState({
            format,
            method,
        })
    }
}
