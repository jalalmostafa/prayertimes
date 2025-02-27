import { Prayer } from './prayer-times'

export interface ILocalized {
    title: string
    message?: string
}

class I18nService {
    [key: string]: any

    getAppMessage(key: string): string {
        return chrome.i18n.getMessage(key)
    }

    private getPrayerMessage(key: Prayer, messageKey: string): ILocalized {
        return {
            message: chrome.i18n.getMessage(messageKey),
            title: chrome.i18n.getMessage(key),
        }
    }

    get languageCode() {
        const language = chrome.i18n.getUILanguage()
        return language.includes('_') ? language.split('_')[0] : language
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

    get hijriDateAdjustment() {
        return this.getAppMessage('hijriDateAdjustment')
    }

    get location() {
        return this.getAppMessage('location')
    }

    get locationDesc() {
        return this.getAppMessage('locationDesc')
    }

    get isRtl() {
        const lang = this.languageCode
        return lang === 'ar' || lang === 'fa'
    }

    get calculationOptionSectionHeader() {
        return this.getAppMessage('calculationOptionSectionHeader')
    }

    get othersOptionSectionHeader() {
        return this.getAppMessage('othersOptionSectionHeader')
    }

    get hanafiAdjustments() {
        return this.getAppMessage('hanafiAdjustments')
    }
}

export const i18n = new I18nService()
