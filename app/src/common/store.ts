import moment from 'moment'

import { calculator, IAppPrayerTimes } from './calculator'
import { MethodType, Prayer } from './prayer-times'

export type PrayerNotifications = Record<Prayer, boolean>

export namespace store {
    const DateFormat = 'YYYY-MM-DD'

    export const defaultPrayerTimes: IAppPrayerTimes = {
        asr: '--:--',
        date: moment().format(DateFormat),
        dhuhr: '--:--',
        fajr: '--:--',
        imsak: '--:--',
        isha: '--:--',
        maghrib: '--:--',
        midnight: '--:--',
        sunrise: '--:--',
        sunset: '--:--',
    }
    export const defaultFormat = false
    export const defaultMethod = 'Tehran'
    export const defaultNotifications = {
        asr: false,
        dhuhr: true,
        fajr: true,
        imsak: true,
        isha: false,
        maghrib: true,
        midnight: false,
        sunrise: false,
        sunset: false,
    }

    export function prayerTimes(calcMethod?: string, format?: boolean): Promise<IAppPrayerTimes> {
        return new Promise<IAppPrayerTimes>((resolve) => {
            chrome.storage.local.get(['times', 'format', 'method'], async (result) => {
                if (result.times &&
                    result.times.date === moment().format(DateFormat) &&
                    result.format === format &&
                    result.method === calcMethod) {
                    resolve(result.times)
                } else {
                    const methd = calcMethod as MethodType || defaultMethod
                    const times = await calculator.prayerTimes(methd, format ? '12h' : '24h')
                    chrome.storage.local.set({
                        format,
                        method: calcMethod,
                        times,
                    }, () => {
                        resolve(times)
                    })
                }
            })
        })
    }

    export function hourFormat(format?: boolean): Promise<boolean> {
        return !!format ? setField<boolean>('format', format) : getFieldOrDefault<boolean>('format', defaultFormat)
    }

    export function method(calcMethod?: string): Promise<string> {
        return !!calcMethod ? setField<string>('method', calcMethod) : getFieldOrDefault<string>('method', defaultMethod)
    }

    export function notifications(notifs?: PrayerNotifications): Promise<PrayerNotifications> {
        return !!notifs ? setField<PrayerNotifications>('notifications', notifs)
            : getFieldOrDefault<PrayerNotifications>('notifications', defaultNotifications)
    }

    function getFieldOrDefault<T>(fieldName: string, defaultValue: T): Promise<T> {
        return new Promise<T>((resolve) => {
            chrome.storage.local.get(fieldName, (result) => {
                resolve(result[fieldName] as T || defaultValue)
            })
        })
    }

    function setField<T>(fieldName: string, value: T): Promise<T> {
        return new Promise<T>((resolve) => {
            const obj = {}
            obj[fieldName] = value
            chrome.storage.local.set(obj, () => {
                resolve(obj[fieldName] as T)
            })
        })
    }
}
