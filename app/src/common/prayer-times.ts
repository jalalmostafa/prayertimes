// --------------------- Copyright Block ----------------------
/*

PrayTimes.js: Prayer Times Calculator (ver 2.3)
Copyright (C) 2007-2011 PrayTimes.org

Developer: Hamid Zarrabi-Zadeh
License: GNU LGPL v3.0

TERMS OF USE:
	Permission is granted to use this code, with or
	without modification, in any website or application
	provided that credit is given to the original work
	with a link back to PrayTimes.org.

This program is distributed in the hope that it will
be useful, but WITHOUT ANY WARRANTY.

PLEASE DO NOT REMOVE THIS COPYRIGHT BLOCK.

*/

// ----------------------- PrayTimes Class ------------------------
type OptionalArgumentType = 'auto' | number
type ParamType = string | number

export type DateTuple = [number, number, number]
export type CoordinatesTuple = [number, number, number] | [number, number]
export type FormatType = '24h' | '12h' | '12hNS' | 'Float'
export type MethodType = 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi' | 'Tehran' | 'Jafari'
export type Prayer = 'asr' | 'dhuhr' | 'fajr' | 'imsak' | 'isha' | 'maghrib' | 'midnight' | 'sunrise' | 'sunset'

export type IPrayerTimes = Record<Prayer, string>
type IRawPrayerTimes = Record<Prayer, number>
type ISettings = Partial<Record<Prayer | 'highLats', ParamType>>

export namespace DMath {

    export function dtr(d: number) {
        return (d * Math.PI) / 180.0
    }

    export function rtd(r: number) {
        return (r * 180.0) / Math.PI
    }

    export function sin(d: number) {
        return Math.sin(dtr(d))
    }

    export function cos(d: number) {
        return Math.cos(dtr(d))
    }

    export function tan(d: number) {
        return Math.tan(dtr(d))
    }

    export function arcsin(d: number) {
        return rtd(Math.asin(d))
    }

    export function arccos(d: number) {
        return rtd(Math.acos(d))
    }

    export function arctan(d: number) {
        return rtd(Math.atan(d))
    }

    export function arccot(x: number) {
        return rtd(Math.atan(1 / x))
    }

    export function arctan2(y: number, x: number) {
        return rtd(Math.atan2(y, x))
    }

    export function fixAngle(a: number) {
        return fix(a, 360)
    }

    export function fixHour(a: number) {
        return fix(a, 24)
    }

    export function fix(a: number, b: number) {
        a = a - b * (Math.floor(a / b))
        return (a < 0) ? a + b : a
    }
}

export const timeNames = {
    asr: 'Asr',
    dhuhr: 'Dhuhr',
    fajr: 'Fajr',
    imsak: 'Imsak',
    isha: 'Isha',
    maghrib: 'Maghrib',
    midnight: 'Midnight',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
}

export const methods = {
    Egypt: {
        name: 'Egyptian General Authority of Survey',
        params: { fajr: 19.5, isha: 17.5 },
    },
    ISNA: {
        name: 'Islamic Society of North America (ISNA)',
        params: { fajr: 15, isha: 15 },
    },
    Jafari: {
        name: 'Shia Ithna-Ashari, Leva Institute, Qum',
        params: { fajr: 16, isha: 14, maghrib: 4, midnight: 'Jafari' },
    },
    Karachi: {
        name: 'University of Islamic Sciences, Karachi',
        params: { fajr: 18, isha: 18 },
    },
    MWL: {
        name: 'Muslim World League',
        params: { fajr: 18, isha: 17 },
    },
    Makkah: {
        name: 'Umm Al-Qura University, Makkah',
        params: { fajr: 18.5, isha: '90 min' },
    },  // fajr was 19 degrees before 1430 hijri
    Tehran: {
        name: 'Institute of Geophysics, University of Tehran',
        params: { fajr: 17.7, isha: 14, maghrib: 4.5, midnight: 'Jafari' },
    },
}

export const defaultParams = {
    maghrib: '0 min',
    midnight: 'Standard',
}

class PrayerTimes {
    // Default
    private calcMethod: MethodType = 'MWL'
    private setting: ISettings = {
        asr: 'Standard',
        dhuhr: '0 min',
        highLats: 'NightMiddle',
        imsak: '10 min',
    }
    private timeFormat: FormatType = '24h'
    private timeSuffixes = ['am', 'pm']
    private invalidTime = '-----'

    private numIterations = 1
    private offset = {}

    // Local
    private lat: number
    private lng: number
    private elv: number       // coordinates
    private timeZone: number
    private jDate: number     // time variables

    constructor(method?: MethodType) {
        const defParams = defaultParams
        for (const meth in methods) {
            if (methods.hasOwnProperty(meth)) {
                const methodParams = methods[meth].params
                for (const j in defParams) {
                    if ((typeof (methodParams[j]) === 'undefined')) {
                        methodParams[j] = defParams[j]
                    }
                }
            }
        }

        this.calcMethod = method && methods[method] ? method : this.calcMethod

        const params = methods[this.calcMethod].params
        for (const id in params) {
            if (params.hasOwnProperty(id)) {
                this.setting[id] = params[id]
            }
        }

        // init time offsets
        for (const i in timeNames) {
            if (timeNames.hasOwnProperty(i)) {
                this.offset[i] = 0
            }
        }
    }

    public set method(method: MethodType) {
        this.adjust(methods[method].params)
        this.calcMethod = method
    }

    // get current calculation method
    public get method() {
        return this.calcMethod
    }

    // set calculating parameters
    public adjust(params: any) {
        for (const id in params) {
            if (params.hasOwnProperty(id)) {
                this.setting[id] = params[id]
            }
        }
    }

    // set time offsets
    public tune(timeOffsets: any) {
        for (const i in timeOffsets) {
            if (timeOffsets.hasOwnProperty(i)) {
                this.offset[i] = timeOffsets[i]
            }
        }
    }

    // get current setting
    public get settings() {
        return this.setting
    }

    // get current time offsets
    public get offsets() {
        return this.offset
    }

    // get default calc parametrs
    public get defaults() {
        return methods
    }

    // convert Gregorian date to Julian day
    // Ref: Astronomical Algorithms by Jean Meeus
    public julian(year: number, month: number, day: number): number {
        if (month <= 2) {
            year -= 1
            month += 12
        }

        const A = Math.floor(year / 100)
        const B = 2 - A + Math.floor(A / 4)

        const JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5
        return JD
    }

    // return prayer times for a given date
    public getTimes(date: Date | DateTuple, coords: CoordinatesTuple, timezone?: OptionalArgumentType,
                    dst?: OptionalArgumentType, format?: FormatType): PrayerTimes {
        this.lat = 1 * coords[0]
        this.lng = 1 * coords[1]
        this.elv = coords[2] ? 1 * coords[2] : 0

        this.timeFormat = format || this.timeFormat

        if (date instanceof Date) {
            date = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
        }

        if (typeof (timezone) === 'undefined' || timezone === 'auto') {
            timezone = this.getTimeZone(date)
        }

        if (typeof (dst) === 'undefined' || dst === 'auto') {
            dst = this.getDst(date)
        }

        this.timeZone = 1 * (timezone as number) + (1 * (dst as number) ? 1 : 0)
        this.jDate = this.julian(date[0], date[1], date[2]) - this.lng / (15 * 24)

        return this.computeTimes()
    }

    // convert float time to the given format (see timeFormats)
    public getFormattedTime(time: number, format: FormatType, suffixes?: any[]): string | number {
        if (isNaN(time)) {
            return this.invalidTime
        }

        if (format === 'Float') {
            return time
        }

        suffixes = suffixes || this.timeSuffixes

        time = DMath.fixHour(time + 0.5 / 60) // add 0.5 minutes to round
        const hours = Math.floor(time)
        const minutes = Math.floor((time - hours) * 60)
        const suffix = (format === '12h') ? suffixes[hours < 12 ? 0 : 1] : ''
        const hour = (format === '24h') ? this.twoDigitsFormat(hours) : ((hours + 12 - 1) % 12 + 1)
        return hour + ':' + this.twoDigitsFormat(minutes) + (suffix ? ' ' + suffix : '')
    }

    // compute mid-day time
    public midDay(time: number) {
        const eqt = this.sunPosition(this.jDate + time).equation
        const noon = DMath.fixHour(12 - eqt)
        return noon
    }

    // compute the time at which sun reaches a specific angle below horizon
    public sunAngleTime(angle: number, time: number, direction?: string) {
        const decl = this.sunPosition(this.jDate + time).declination
        const noon = this.midDay(time)
        const t = 1 / 15 * DMath.arccos((-DMath.sin(angle) - DMath.sin(decl) * DMath.sin(this.lat)) /
            (DMath.cos(decl) * DMath.cos(this.lat)))
        return noon + (direction === 'ccw' ? -t : t)
    }

    // compute asr time
    public asrTime(factor: number, time: number) {
        const decl = this.sunPosition(this.jDate + time).declination
        const angle = -DMath.arccot(factor + DMath.tan(Math.abs(this.lat - decl)))
        return this.sunAngleTime(angle, time)
    }

    // compute declination angle of sun and equation of time
    // Ref: http://aa.usno.navy.mil/faq/docs/SunApprox.php
    public sunPosition(jd: number) {
        const D = jd - 2451545.0
        const g = DMath.fixAngle(357.529 + 0.98560028 * D)
        const q = DMath.fixAngle(280.459 + 0.98564736 * D)
        const L = DMath.fixAngle(q + 1.915 * DMath.sin(g) + 0.020 * DMath.sin(2 * g))

        // const R = 1.00014 - 0.01671 * DMath.cos(g) - 0.00014 * DMath.cos(2 * g)
        const e = 23.439 - 0.00000036 * D

        const RA = DMath.arctan2(DMath.cos(e) * DMath.sin(L), DMath.cos(L)) / 15
        const eqt = q / 15 - DMath.fixHour(RA)
        const decl = DMath.arcsin(DMath.sin(e) * DMath.sin(L))

        return { declination: decl, equation: eqt }
    }

    // compute prayer times at given julian date
    public computePrayerTimes(times: IRawPrayerTimes) {
        times = this.dayPortion(times)
        const params = this.setting

        const imsak = this.sunAngleTime(this.eval(params.imsak as ParamType), times.imsak, 'ccw')
        const fajr = this.sunAngleTime(this.eval(params.fajr as ParamType), times.fajr, 'ccw')
        const sunrise = this.sunAngleTime(this.riseSetAngle(), times.sunrise, 'ccw')
        const dhuhr = this.midDay(times.dhuhr)
        const asr = this.asrTime(this.asrFactor(params.asr as ParamType), times.asr)
        const sunset = this.sunAngleTime(this.riseSetAngle(), times.sunset)
        const maghrib = this.sunAngleTime(this.eval(params.maghrib as ParamType), times.maghrib)
        const isha = this.sunAngleTime(this.eval(params.isha as ParamType), times.isha)

        return {
            asr, dhuhr, fajr, imsak, isha, maghrib, sunrise, sunset,
        }
    }

    // compute prayer times
    public computeTimes() {
        // default times
        let times: any = {
            asr: 13, dhuhr: 12, fajr: 5, imsak: 5, isha: 18, maghrib: 18, sunrise: 6, sunset: 18,
        }

        // main iterations
        for (let i = 1; i <= this.numIterations; i++) {
            times = this.computePrayerTimes(times)
        }

        times = this.adjustTimes(times)

        // add midnight time
        times.midnight = (this.setting.midnight === 'Jafari') ?
            times.sunset + this.timeDiff(times.sunset, times.fajr) / 2 :
            times.sunset + this.timeDiff(times.sunset, times.sunrise) / 2

        times = this.tuneTimes(times)
        return this.modifyFormats(times)
    }

    // adjust times
    public adjustTimes(times: IRawPrayerTimes) {
        const params = this.setting

        for (const i in times) {
            if (times.hasOwnProperty(i)) {
                times[i] += this.timeZone - this.lng / 15
            }
        }

        if (params.highLats !== 'None') {
            times = this.adjustHighLats(times)
        }

        if (this.isMin(params.imsak as ParamType)) {
            times.imsak = times.fajr - this.eval(params.imsak as ParamType) / 60
        }

        if (this.isMin(params.maghrib as ParamType)) {
            times.maghrib = times.sunset + this.eval(params.maghrib as ParamType) / 60
        }

        if (this.isMin(params.isha as ParamType)) {
            times.isha = times.maghrib + this.eval(params.isha as ParamType) / 60
        }

        times.dhuhr += this.eval(params.dhuhr as ParamType) / 60

        return times
    }

    // get asr shadow factor
    public asrFactor(asrParam: ParamType) {
        const factor = { Standard: 1, Hanafi: 2 }[asrParam]
        return factor || this.eval(asrParam)
    }

    // return sun angle for sunset/sunrise
    public riseSetAngle() {
        const angle = 0.0347 * Math.sqrt(this.elv) // an approximation
        return 0.833 + angle
    }

    // apply offsets to the times
    public tuneTimes(times: IRawPrayerTimes) {
        for (const i in times) {
            if (times.hasOwnProperty(i)) {
                times[i] += this.offset[i] / 60
            }
        }
        return times
    }

    // convert times to given time format
    public modifyFormats(times: IRawPrayerTimes): PrayerTimes {
        const formattedTimes: any = {}
        for (const i in times) {
            if (times.hasOwnProperty(i)) {
                formattedTimes[i] = this.getFormattedTime(times[i], this.timeFormat)
            }
        }
        return formattedTimes as PrayerTimes
    }

    // adjust times for locations in higher latitudes
    public adjustHighLats(times: IRawPrayerTimes) {
        const params = this.setting
        const nightTime = this.timeDiff(times.sunset, times.sunrise)

        times.imsak = this.adjustHLTime(times.imsak, times.sunrise, this.eval(params.imsak as ParamType), nightTime, 'ccw')
        times.fajr = this.adjustHLTime(times.fajr, times.sunrise, this.eval(params.fajr as ParamType), nightTime, 'ccw')
        times.isha = this.adjustHLTime(times.isha, times.sunset, this.eval(params.isha as ParamType), nightTime)
        times.maghrib = this.adjustHLTime(times.maghrib, times.sunset, this.eval(params.maghrib as ParamType), nightTime)

        return times
    }

    // adjust a time for higher latitudes
    public adjustHLTime(time: number, base: number, angle: number, night: number, direction?: string) {
        const portion = this.nightPortion(angle, night)
        const timeDiff = (direction === 'ccw') ?
            this.timeDiff(time, base) :
            this.timeDiff(base, time)

        if (isNaN(time) || timeDiff > portion) {
            time = base + (direction === 'ccw' ? -portion : portion)
        }

        return time
    }

    // the night portion used for adjusting times in higher latitudes
    public nightPortion(angle: number, night: number) {
        const method = this.setting.highLats
        let portion = 1 / 2 // MidNight

        if (method === 'AngleBased') {
            portion = 1 / 60 * angle
        }

        if (method === 'OneSeventh') {
            portion = 1 / 7
        }
        return portion * night
    }

    // convert hours to day portions
    public dayPortion(times: IRawPrayerTimes) {
        for (const i in times) {
            if (times.hasOwnProperty(i)) {
                times[i] /= 24
            }
        }
        return times
    }

    // get local time zone
    public getTimeZone(date: DateTuple) {
        const year = date[0]
        const t1 = this.gmtOffset([year, 0, 1])
        const t2 = this.gmtOffset([year, 6, 1])
        return Math.min(t1, t2)
    }

    // get daylight saving for a given date
    public getDst(date: DateTuple) {
        return 1 * (this.gmtOffset(date) !== this.getTimeZone(date) ? 1 : 0)
    }

    // GMT offset for a given date
    public gmtOffset(date: DateTuple) {
        const localDate = new Date(date[0], date[1] - 1, date[2], 12, 0, 0, 0)
        const UTCString = localDate.toUTCString()
        const UTCDate = new Date(UTCString.substring(0, UTCString.lastIndexOf(' ') - 1))
        const hoursDiff = (localDate.getTime() - UTCDate.getTime()) / (1000 * 60 * 60)
        return hoursDiff
    }

    // convert given string into a number
    public eval(str: string | number) {
        const val = str.toString().split(/[^0-9.+-]/)[0]
        return 1 * parseFloat(val)
    }

    // detect if input contains 'min'
    public isMin(arg: string | number) {
        return arg.toString().indexOf('min') !== -1
    }

    // compute the difference between two times
    public timeDiff(time1: number, time2: number) {
        return DMath.fixHour(time2 - time1)
    }

    // add a leading 0 if necessary
    public twoDigitsFormat(num: number) {
        return (num < 10) ? '0' + num : num
    }
}

export default new PrayerTimes()
