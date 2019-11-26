import React from 'react'

import { i18n } from '../common/i18n-service'
import { methods, MethodType } from '../common/prayer-times'
import { store } from '../common/store'

interface IMethodState {
    value: MethodType
}

export class Method extends React.Component<{}, IMethodState> {

    constructor(props: {}) {
        super(props)
        this.state = {
            value: store.defaultMethod,
        }
        this.loadPage()
    }

    methodChanged = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target
        await store.prayerTimes(value)
        store.notifyBackground()
        const method = (value || store.defaultMethod) as MethodType
        this.setState({
            value: method,
        })
    }

    render() {
        return (
            <div className="option-container">
                <label htmlFor="method" className="option-label">{i18n.method}</label>
                <span className="option-control">
                    <select
                        id="method"
                        value={this.state.value}
                        onChange={this.methodChanged}
                    >
                        {Object.keys(methods).map((m) => <option key={m} value={m}>{methods[m].name}</option>)}
                    </select>
                </span>
            </div>
        )
    }

    private async loadPage() {
        const method = (await store.method() || store.defaultMethod) as MethodType
        this.setState({
            value: method,
        })
    }
}
