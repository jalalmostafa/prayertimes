import ky from 'ky'
import moment from 'moment'

import prayTimes, { CoordinatesTuple, DateTuple, IPrayerTimes, MethodType } from './prayer-times'

export interface IAppPrayerTimes extends IPrayerTimes {
    date: string
    [key: string]: string
}

export type LatLng = [number, number]

export interface IpApiResponse {
    status: 'success' | 'fail'
    message: string
    countryCode: string
    zip: string
    lat: number
    lon: number
}

export namespace calculator {

    function getTimes(loc: CoordinatesTuple): IAppPrayerTimes {
        const dateArray: DateTuple = [moment().year(), moment().month(), moment().date()]
        return {
            ...prayTimes.getTimes(new Date(), loc, prayTimes.getTimeZone(dateArray), 'auto'),
            date: moment().format('YYYY-MM-DD'),
        } as IAppPrayerTimes
    }

    export async function prayerTimes(method: MethodType, loc: LatLng): Promise<IAppPrayerTimes> {
        prayTimes.method = method
        const times: IAppPrayerTimes = getTimes(loc)
        return times
    }

    export async function location(): Promise<LatLng> {
        const data = await ky
            .post(`http://ip-api.com/json/?fields=status,message,countryCode,zip,lat,lon`)
            .json<IpApiResponse>()
        const loc: CoordinatesTuple = [data.lat, data.lon]
        return loc
    }
}
