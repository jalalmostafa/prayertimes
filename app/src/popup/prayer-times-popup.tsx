import './flaticon.css'
import './main.css'

import moment from 'moment'
import Switch from 'rc-switch'
import React from 'react'

import { IAppPrayerTimes } from '../common/calculator'
import { i18n } from '../common/i18n-service'
import { methods, Prayer } from '../common/prayer-times'
import { PrayerNotifications, store } from '../common/store'
import { PrayerTimeEntry } from './prayer-time-entry'

interface IPopupState {
    format: boolean
    times: IAppPrayerTimes
    notifs: PrayerNotifications
    method: string
}

export class PrayerTimesPopup extends React.Component<{}, IPopupState> {

    static visiblePrayers: Prayer[] = ['imsak', 'fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha']

    static prayerIcons = {
        asr: 'flaticon-ramadn-azhar',
        dhuhr: 'flaticon-zuhar-prayer',
        fajr: 'flaticon-subah-prayer',
        imsak: 'flaticon-arabian-lantern',
        isha: 'flaticon-isha-prayer',
        maghrib: 'flaticon-maghrib-prayer',
        sunrise: 'flaticon-ramadan-sunrise',
    }

    state = {
        format: store.defaultFormat,
        method: store.defaultMethod,
        notifs: store.defaultNotifications,
        times: store.defaultPrayerTimes,
    }

    constructor(props: Readonly<{}>) {
        super(props)
        this.loadPage()
    }

    formatChanged = async (checked: boolean) => {
        const times = await store.prayerTimes(this.state.method, checked)
        this.setState({
            format: checked,
            times,
        })
    }

    methodChanged = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target
        const times = await store.prayerTimes(value, this.state.format)
        this.setState({
            method: value,
            times,
        })
        this.notifyBackground()
    }

    notifyChanged = async (key: Prayer) => {
        const { notifs } = this.state
        const notifsCopy = Object.assign({}, notifs)
        notifsCopy[key] = !notifsCopy[key]
        const newNotifs = await store.notifications(notifsCopy)
        this.setState({
            notifs: newNotifs,
        })
        this.notifyBackground()
    }

    render() {
        return (
            <div className="container">
                <div className="row header">
                    <i className="flaticon-small-mosque flaticon-lg main-icon" />
                    <h3 className="header-text">{i18n.header.title}</h3>
                </div>
                <hr className="line" />
                <div className="content">
                    {PrayerTimesPopup.visiblePrayers.map((p) =>
                        <PrayerTimeEntry
                            key={p}
                            code={p}
                            time={this.state.times[p]}
                            message={i18n[p].title}
                            notifyChanged={this.notifyChanged}
                            icon={PrayerTimesPopup.prayerIcons[p]}
                            notify={this.state.notifs[p]}
                        />,
                    )}
                </div>
                <div className="method">
                    <label htmlFor="method" className="method-label">{i18n.method.title}</label>
                    <span className="method-control">
                        <select
                            id="method"
                            value={this.state.method}
                            onChange={this.methodChanged}
                        >
                            {Object.keys(methods).map((m) => <option key={m} value={m}>{methods[m].name}</option>)}
                        </select>
                    </span>
                </div>

                <div className="hour-format">
                    <label htmlFor="hourFormat" className="hour-format-label">{i18n.format.title}</label>
                    <span className="hour-format-control">
                        <span id="hourFormat" className="green small">
                            <Switch
                                checked={this.state.format}
                                checkedChildren=""
                                unCheckedChildren=""
                                onChange={this.formatChanged}
                            />
                        </span>
                    </span>
                </div>
            </div>
        )
    }

    private reformat(time: string, format: boolean) {
        return !format ? time : moment(time, 'h:mm A').format('hh:mm A')
    }

    private updateTimes(times: IAppPrayerTimes, format: boolean): IAppPrayerTimes {
        const keys = Object.keys(times)
        for (const key of keys) {
            times[key] = this.reformat(times[key], format)
        }

        return times
    }

    private async loadPage() {
        const [t, format, notifs, method] =
            await Promise.all([store.prayerTimes(), store.hourFormat(), store.notifications(), store.method()])

        const times = this.updateTimes(t, format)

        this.setState({
            format: format || store.defaultFormat,
            method: method || store.defaultMethod,
            notifs: notifs || store.defaultNotifications,
            times: times || store.defaultPrayerTimes,
        })
    }

    private notifyBackground() {
        const port = chrome.runtime.connect()
        if (port) {
            port.postMessage({
                command: 'config-changed',
            })
        }
    }
}
