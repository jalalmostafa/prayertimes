import '../../assets/solemn.mp3'

import moment, { Moment } from 'moment'

import { IAppPrayerTimes } from '../common/calculator'
import { Prayer } from '../common/prayer-times'
import { PrayerNotifications, store } from '../common/store'

const playDefaultSound = () => {
    new Audio('solemn.mp3').play()
}

const Messages = {
    asr: {
        message: chrome.i18n.getMessage('asrNotification'),
        title: chrome.i18n.getMessage('asr'),
    },
    dhuhr: {
        message: chrome.i18n.getMessage('dhuhrNotification'),
        title: chrome.i18n.getMessage('dhuhr'),
    },
    fajr: {
        message: chrome.i18n.getMessage('fajrNotification'),
        title: chrome.i18n.getMessage('fajr'),
    },
    fixMessage: {
        title: chrome.i18n.getMessage('fixMessage'),
    },
    format: {
        title: chrome.i18n.getMessage('format'),
    },
    header: {
        title: chrome.i18n.getMessage('header'),
    },
    imsak: {
        message: chrome.i18n.getMessage('imsakNotification'),
        title: chrome.i18n.getMessage('imsak'),
    },
    isha: {
        message: chrome.i18n.getMessage('ishaNotification'),
        title: chrome.i18n.getMessage('isha'),
    },
    maghrib: {
        message: chrome.i18n.getMessage('maghribNotification'),
        title: chrome.i18n.getMessage('maghrib'),
    },
    method: {
        title: chrome.i18n.getMessage('method'),
    },
    notifications: {
        title: chrome.i18n.getMessage('notifications'),
    },
    notificationsMessage: {
        title: chrome.i18n.getMessage('notificationsMessage'),
    },
    options: {
        title: chrome.i18n.getMessage('options'),
    },
    sunrise: {
        message: chrome.i18n.getMessage('sunriseNotification'),
        title: chrome.i18n.getMessage('sunrise'),
    },
    updateMessage: {
        title: chrome.i18n.getMessage('updateMessage'),
    },
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

run()

chrome.runtime.onConnect.addListener((port) => {
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
})

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason) {
        switch (details.reason) {
            case 'install':
                onInstallUpdate(Messages.notificationsMessage.title, Messages.header.title)
                break
            case 'update':
                // onInstallUpdate(Messages.fixMessage.title, Messages.header.title);
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
        const alarmData = Messages[alarm.name]
        const now = moment()
        const times = store.prayerTimes()
        const deadline = moment(times[alarm.name], 'HH:mm').add(5, 'minutes')

        console.warn(deadline.format())
        console.warn(now.format())

        if (deadline && !now.isSameOrAfter(deadline)) {
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
