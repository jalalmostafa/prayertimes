import React from 'react'

import { i18n } from '../common/i18n-service'
import { store } from '../common/store'

interface IAdjustHijriDateState {
    value: number
}

export class AdujstHijriDate extends React.Component<{}, IAdjustHijriDateState> {

    constructor(props: {}) {
        super(props)
        this.state = {
            value: store.defaultHijriDateAdjustment,
        }
        this.loadPage()
    }

    adjustmentChanged = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target
        const adjustment = await store.hijriDateAdjustment(parseInt(value, 10))
        this.setState({
            value: adjustment,
        })
    }

    render() {
        return (
            <div className="option-container">
                <span className="option-label-wrapper">
                    <span className="option-label">{i18n.hijriDateAdjustment}</span>
                </span>
                <span className="option-control">
                    <span className="green small">
                        <select value={this.state.value} onChange={this.adjustmentChanged}>
                            <option value="-2">-2</option>
                            <option value="-1">-1</option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                        </select>
                    </span>
                </span>
            </div>
        )
    }

    private async loadPage() {
        const adjust = await store.hijriDateAdjustment() || store.defaultHijriDateAdjustment
        this.setState({
            value: adjust,
        })
    }
}
