import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import { Prayer } from '../common/prayer-times'
import { i18n } from '../common/i18n-service'

interface IEntryProps {
    code: Prayer
    message: string
    notify: boolean
    time: string
    icon: string
    notifyChanged: (key: Prayer) => void
}

export class PrayerTimeEntry extends React.Component<IEntryProps, {}> {
    notifyChanged = () => {
        this.props.notifyChanged(this.props.code)
    }

    render() {
        return (
            <div className="row app-entry">
                <span onClick={this.notifyChanged}>
                    <FontAwesomeIcon
                        icon="bell"
                        className={'small-icon ' + (this.props.notify ? 'prayer-on' : 'prayer-off')}
                    />
                    <span className="prayer-text">{this.props.time}</span>
                </span>
                <span className={i18n.isRtl ? 'prayer-text cairo-style' : 'prayer-text'}>{this.props.message}</span>
                <span className="small-icon">
                    <i className={'flaticon-md ' + this.props.icon} />
                </span>
            </div>
        )
    }
}
