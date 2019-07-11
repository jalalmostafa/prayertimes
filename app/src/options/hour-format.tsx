import Switch from 'rc-switch'
import React from 'react'

import { i18n } from '../common/i18n-service'
import { store } from '../common/store'

interface IFormatProps {
    value: boolean
    onChange: (format: boolean) => void
}

export class HourFormat extends React.Component<IFormatProps, {}> {

    formatChanged = async (checked: boolean) => {
        const format = await store.hourFormat(checked)
        this.props.onChange(format)
    }

    render() {
        return (
            <div className="hour-format">
                <label htmlFor="hourFormat" className="hour-format-label">{i18n.format.title}</label>
                <span className="hour-format-control">
                    <span id="hourFormat" className="green small">
                        <Switch
                            checked={this.props.value}
                            checkedChildren=""
                            unCheckedChildren=""
                            onChange={this.formatChanged}
                        />
                    </span>
                </span>
            </div>
        )
    }
}
