import '../style/flaticon.css'
import './main.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import React from 'react'

import { IAppPrayerTimes } from '../common/calculator'
import { i18n } from '../common/i18n-service'
import { Prayer } from '../common/prayer-times'
import { PrayerNotifications, store } from '../common/store'
import { PrayerTimeEntry } from './prayer-time-entry'

interface IPopupState {
    times: IAppPrayerTimes
    notifs: PrayerNotifications
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
        notifs: store.defaultNotifications,
        times: store.defaultPrayerTimes,
    }

    constructor(props: Readonly<{}>) {
        super(props)
        this.loadPage()
    }

    notifyChanged = async (key: Prayer) => {
        const { notifs } = this.state
        const notifsCopy = Object.assign({}, notifs)
        notifsCopy[key] = !notifsCopy[key]
        const newNotifs = await store.notifications(notifsCopy)
        this.setState({
            notifs: newNotifs,
        })
        store.notifyBackground()
    }

    goToOptionsPage = () => {
        chrome.runtime.openOptionsPage ?
            chrome.runtime.openOptionsPage() :
            window.open(chrome.runtime.getURL('options.html'))
    }

    render() {
        return (
            <div className="container">
                <div className="row header">
                    <i className="flaticon-small-mosque flaticon-lg main-icon" />
                    <h3 className="header-text">{i18n.header}</h3>
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
                    <div className="options" onClick={this.goToOptionsPage}>
                        <FontAwesomeIcon icon="cogs" className="options-icon" />
                    </div>
                </div>
            </div>
        )
    }

    private reformat(time: string, format: boolean) {
        return !format ? time : moment(time, 'HH:mm').format('hh:mm A')
    }

    private updateTimes(times: IAppPrayerTimes, format: boolean): IAppPrayerTimes {
        const keys = Object.keys(times)
        for (const key of keys) {
            times[key] = this.reformat(times[key], format)
        }

        return times
    }

    private async loadPage() {
        const [t, format, notifs] =
            await Promise.all([store.prayerTimes(), store.hourFormat(), store.notifications()])

        const times = this.updateTimes(t, format)

        this.setState({
            notifs: notifs || store.defaultNotifications,
            times: times || store.defaultPrayerTimes,
        })
    }
}
