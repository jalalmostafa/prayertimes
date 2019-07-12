import * as React from 'react'

import { i18n } from '../common/i18n-service'
import { methods, MethodType } from '../common/prayer-times'
import { store } from '../common/store'

interface IMethodProps {
    value: MethodType
    onChange: (newMethod: MethodType) => void
}

export class Method extends React.Component<IMethodProps, {}> {

    methodChanged = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target
        await store.prayerTimes(value)
        store.notifyBackground()
        this.props.onChange(value as MethodType)
    }

    render() {
        return (
            <div className="method">
                <label htmlFor="method" className="method-label">{i18n.method.title}</label>
                <span className="method-control">
                    <select
                        id="method"
                        value={this.props.value}
                        onChange={this.methodChanged}
                    >
                        {Object.keys(methods).map((m) => <option key={m} value={m}>{methods[m].name}</option>)}
                    </select>
                </span>
            </div>
        )
    }
}
