import '../style/flaticon.css'
import './main.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import umalqura from '@umalqura/core'
import moment from 'moment'
import React from 'react'

import { IAppPrayerTimes } from '../common/calculator'
import { i18n } from '../common/i18n-service'
import { Prayer } from '../common/prayer-times'
import { PrayerNotifications, store } from '../common/store'
import { PrayerTimeEntry } from './prayer-time-entry'

interface IPopupState {
    hijriAdjustments: number
    times: IAppPrayerTimes
    notifs: PrayerNotifications
}

export class PrayerTimesPopup extends React.Component<{}, IPopupState> {

    static visiblePrayers: Prayer[] = ['imsak', 'fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha']

    static prayerIcons: Record<string, string> = {
        asr: 'flaticon-ramadn-azhar',
        dhuhr: 'flaticon-zuhar-prayer',
        fajr: 'flaticon-subah-prayer',
        imsak: 'flaticon-arabian-lantern',
        isha: 'flaticon-isha-prayer',
        maghrib: 'flaticon-maghrib-prayer',
        sunrise: 'flaticon-ramadan-sunrise',
    }

    state = {
        hijriAdjustments: store.defaultHijriDateAdjustment,
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
        const rtl = i18n.isRtl
        return (
            <div className="container">
                <div className={rtl ? 'row header rtl-style' : 'row header'}>
                    <i className="flaticon-small-mosque flaticon-lg main-icon" />
                    <span className="header-text">
                        <p className={rtl ? 'cairo-style header-text-title' : 'header-text-title'}>{i18n.header}</p>
                        <p className={rtl ? 'cairo-style header-text-date' : 'header-text-date'}>
                            {umalqura().add(this.state.hijriAdjustments, 'day').format('d MMMM, yyyy', rtl ? 'ar' : 'en')}
                        </p>
                    </span>
                    <div className="options" onClick={this.goToOptionsPage}>
                        <FontAwesomeIcon icon="cogs" className="options-icon" />
                    </div>
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
                        />)}
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
        const [t, format, notifs, adjusts] =
            await Promise.all([store.prayerTimes(), store.hourFormat(), store.notifications(), store.hijriDateAdjustment()])

        const times = this.updateTimes(t, format)

        this.setState({
            hijriAdjustments: adjusts || store.defaultHijriDateAdjustment,
            notifs: notifs || store.defaultNotifications,
            times: times || store.defaultPrayerTimes,
        })
    }
}
