import '../../assets/solemn.mp3'

import moment, { Moment } from 'moment'

import { IAppPrayerTimes } from '../common/calculator'
import { i18n, ILocalized } from '../common/i18n-service'
import { Prayer } from '../common/prayer-times'
import { PrayerNotifications, store } from '../common/store'

const playDefaultSound = () => {
    new Audio('solemn.mp3').play()
}

const onInstallUpdate = (msg: string, header: string) => {
    chrome.notifications.create('onInstalled', {
        iconUrl: 'images/small-mosque.png',
        message: msg,
        title: header,
        type: 'basic',
    }, () => {
        playDefaultSound()
    })
}

const createAlarm = (alarmName: Prayer | 'tomorrow', momentObj: Moment) => {
    const when = momentObj.unix()
    chrome.alarms.create(alarmName, {
        when: when * 1000,
    })
}

const run = async () => {
    const results = await Promise.all([store.prayerTimes(), store.notifications()])
    const times = results[0] as IAppPrayerTimes
    const notifications = results[1] as PrayerNotifications
    const format = 'HH:mm'

    const now = moment()
    const formattedFajr = moment(times.fajr, format)
    const formattedImsak = moment(times.imsak, format)
    const formattedSunrise = moment(times.sunrise, format)
    const formattedDhuhr = moment(times.dhuhr, format)
    const formattedAsr = moment(times.asr, format)
    const formattedMaghrib = moment(times.maghrib, format)
    const formattedIsha = moment(times.isha, format)

    if (!now.isSameOrAfter(formattedFajr) && notifications.fajr) {
        createAlarm('fajr', formattedFajr)
    }

    if (!now.isSameOrAfter(formattedImsak) && notifications.imsak) {
        createAlarm('imsak', formattedImsak)
    }

    if (!now.isSameOrAfter(formattedSunrise) && notifications.sunrise) {
        createAlarm('sunrise', formattedSunrise)
    }

    if (!now.isSameOrAfter(formattedDhuhr) && notifications.dhuhr) {
        createAlarm('dhuhr', formattedDhuhr)
    }

    if (!now.isSameOrAfter(formattedAsr) && notifications.asr) {
        createAlarm('asr', formattedAsr)
    }

    if (!now.isSameOrAfter(formattedMaghrib) && notifications.maghrib) {
        createAlarm('maghrib', formattedMaghrib)
    }

    if (!now.isSameOrAfter(formattedIsha) && notifications.isha) {
        createAlarm('isha', formattedIsha)
    }

    const tomorrow = moment().add(1, 'days').startOf('day')
    createAlarm('tomorrow', tomorrow)
}

chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'background') {
        port.onMessage.addListener((msg) => {
            if (msg.command === 'config-changed') {
                chrome.alarms.clearAll((wasCleared) => {
                    wasCleared ? port.postMessage({
                        changed: true,
                    }) : port.postMessage({
                        changed: false,
                    })
                    run()
                })
            }
        })
    }
})

run()

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason) {
        switch (details.reason) {
            case 'install':
                onInstallUpdate(i18n.notificationsMessage, i18n.header)
                break
            case 'update':
                onInstallUpdate(i18n.updateMessage, i18n.header)
                break
            default:
                break
        }
    }
})

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'tomorrow') {
        run()
    } else {
        const alarmData: ILocalized = i18n[alarm.name]
        const now = moment()
        const deadline = moment(alarm.scheduledTime).add(5, 'minutes')

        if (deadline.isValid() && !now.isAfter(deadline)) {
            chrome.notifications.create(alarm.name, {
                iconUrl: 'images/adhan-call.png',
                message: alarmData.message,
                requireInteraction: true,
                title: alarmData.title,
                type: 'basic',
            }, () => {
                playDefaultSound()
            })
        }
    }
})
