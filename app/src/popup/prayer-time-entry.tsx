import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import { Prayer } from '../common/prayer-times'

interface IEntryProps {
    code: Prayer
    message: string
    notify: boolean
    time: string
    icon: string
    notifyChanged: (key: Prayer) => void
}

interface IEntryState {
    notify: boolean
}

export class PrayerTimeEntry extends React.Component<IEntryProps, IEntryState> {

    state = {
        notify: this.props.notify,
    }

    notifyChanged = () => {
        const { notify } = this.state
        this.props.notifyChanged(this.props.code)
        this.setState({
            notify: !notify,
        })
    }

    render() {
        return (
            <div className="row app-entry">
                <span onClick={this.notifyChanged}>
                    <FontAwesomeIcon
                        icon="bell"
                        className={'small-icon ' + (this.state.notify ? 'prayer-on' : 'prayer-off')}
                    />
                    <span className="prayer-text">{this.props.time}</span>
                </span>
                <span className="prayer-text">{this.props.message}</span>
                <span className="small-icon">
                    <i className={'flaticon-md ' + this.props.icon} />
                </span>
            </div>
        )
    }
}
