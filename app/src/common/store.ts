import moment from 'moment'

import { calculator, IAppPrayerTimes, LatLng } from './calculator'
import { MethodType, Prayer } from './prayer-times'

export type PrayerNotifications = Record<Prayer, boolean>

export interface Place {
    name: string
    placeId: string
    location?: LatLng
}

export namespace store {
    const dateFormat = 'YYYY-MM-DD'

    export const defaultPrayerTimes: IAppPrayerTimes = {
        asr: '--:--',
        date: moment().format(dateFormat),
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
    export const defaultHijriDateAdjustment = 0

    export async function prayerTimes(calcMethod?: string): Promise<IAppPrayerTimes> {
        const result = await chrome.storage.local.get(['times', 'format', 'method'])
        if (result.times &&
            result.times.date === moment().format(dateFormat) &&
            result.method === calcMethod)
            return result.times

        const methd = (typeof calcMethod === 'undefined' ? result.method : calcMethod as MethodType) || defaultMethod
        const loc = await place()
        const times = await calculator.prayerTimes(methd, loc.location as LatLng)

        await chrome.storage.local.set({ method: methd, times })
        return times
    }

    export function hourFormat(format?: boolean): Promise<boolean> {
        return typeof format !== 'undefined' ? setField<boolean>('format', format) : getFieldOrDefault<boolean>('format', defaultFormat)
    }

    export function method(calcMethod?: string): Promise<string> {
        if (typeof calcMethod === 'undefined') {
            return getFieldOrDefault<string>('method', defaultMethod)
        }

        const methd = setField<string>('method', calcMethod)
        return methd
    }

    export function notifications(notifs?: PrayerNotifications): Promise<PrayerNotifications> {
        return typeof notifs !== 'undefined' ? setField<PrayerNotifications>('notifications', notifs)
            : getFieldOrDefault<PrayerNotifications>('notifications', defaultNotifications)
    }

    export async function place(place?: Place): Promise<Place> {
        if (typeof place !== 'undefined')
            return setField<Place>('place', place)

        return getFieldOrDefault<Place>('place', {
            name: '',
            placeId: '',
            location: await calculator.location()
        })
    }

    export function clearTimes(): Promise<void> {
        return chrome.storage.local.remove('times')
    }

    export async function hijriDateAdjustment(adjust?: number): Promise<number> {
        return typeof adjust !== 'undefined' ? setField<number>('hijriDateAdjustment', adjust)
            : getFieldOrDefault<number>('hijriDateAdjustment', defaultHijriDateAdjustment)
    }

    async function getFieldOrDefault<T>(fieldName: string, defaultValue: T): Promise<T> {
        return ((await chrome.storage.local.get(fieldName))[fieldName] as T) || defaultValue
    }

    async function setField<T>(fieldName: string, value: T): Promise<T> {
        const obj: any = {}
        obj[fieldName] = value
        await chrome.storage.local.set(obj)
        return obj[fieldName] as T
    }

    export function notifyBackground() {
        const port = chrome.runtime.connect({ name: 'background' })
        if (port) {
            port.postMessage({
                command: 'config-changed',
            })
        }
    }
}
