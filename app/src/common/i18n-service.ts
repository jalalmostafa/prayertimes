import { Prayer } from './prayer-times'

export interface ILocalized {
    title: string
    message?: string
}

class I18nService {
    getAppMessage(key: string): string {
        return chrome.i18n.getMessage(key)
    }

    private getPrayerMessage(key: Prayer, messageKey: string): ILocalized {
        return {
            message: chrome.i18n.getMessage(messageKey),
            title: chrome.i18n.getMessage(key),
        }
    }

    get fajr() {
        return this.getPrayerMessage('fajr', 'fajrNotification')
    }

    get imsak() {
        return this.getPrayerMessage('imsak', 'imsakNotification')
    }

    get sunrise() {
        return this.getPrayerMessage('sunrise', 'sunriseNotification')
    }

    get dhuhr() {
        return this.getPrayerMessage('dhuhr', 'dhuhrNotification')
    }

    get asr() {
        return this.getPrayerMessage('asr', 'asrNotification')
    }

    get maghrib() {
        return this.getPrayerMessage('maghrib', 'maghribNotification')
    }

    get isha() {
        return this.getPrayerMessage('isha', 'ishaNotification')
    }

    get header() {
        return this.getAppMessage('header')
    }

    get options() {
        return this.getAppMessage('options')
    }

    get notifications() {
        return this.getAppMessage('notifications')
    }

    get notificationsMessage() {
        return this.getAppMessage('notificationsMessage')
    }

    get updateMessage() {
        return this.getAppMessage('updateMessage')
    }

    get fixMessage() {
        return this.getAppMessage('fixMessage')
    }

    get format() {
        return this.getAppMessage('format')
    }

    get method() {
        return this.getAppMessage('method')
    }

    get location() {
        return this.getAppMessage('location')
    }

    get locationDesc() {
        return this.getAppMessage('locationDesc')
    }
}

export const i18n = new I18nService()
