import Switch from 'rc-switch'
import React from 'react'

import { i18n } from '../common/i18n-service'
import { store } from '../common/store'

interface IFormatState {
    value: boolean
}

export class HourFormat extends React.Component<{}, IFormatState> {

    constructor(props: {}) {
        super(props)
        this.state = {
            value: store.defaultFormat,
        }
        this.loadPage()
    }

    formatChanged = async (checked: boolean) => {
        const format = await store.hourFormat(checked)
        this.setState({
            value: format,
        })
    }

    render() {
        return (
            <div className="option-container">
                <label htmlFor="hourFormat" className="option-label">{i18n.format}</label>
                <span className="option-control">
                    <span id="hourFormat" className="green small">
                        <Switch
                            checked={this.state.value}
                            checkedChildren=""
                            unCheckedChildren=""
                            onChange={this.formatChanged}
                        />
                    </span>
                </span>
            </div>
        )
    }

    private async loadPage() {
        const format = await store.hourFormat() || store.defaultFormat
        this.setState({
            value: format,
        })
    }
}
