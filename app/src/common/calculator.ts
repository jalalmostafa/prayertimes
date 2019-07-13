import ky from 'ky'
import moment from 'moment'

import prayTimes, { CoordinatesTuple, DateTuple, IPrayerTimes, MethodType } from './prayer-times'

export interface IAppPrayerTimes extends IPrayerTimes {
    date: string
}

export type LatLng = [number, number]

export namespace calculator {

    function getTimes(loc: CoordinatesTuple): IAppPrayerTimes {
        const dateArray: DateTuple = [moment().year(), moment().month(), moment().date()]
        return {
            ...prayTimes.getTimes(new Date(), loc, prayTimes.getTimeZone(dateArray), 'auto'),
            date: moment().format('YYYY-MM-DD'),
        } as IAppPrayerTimes
    }

    export function prayerTimes(method: MethodType, loc: LatLng): Promise<IAppPrayerTimes> {
        return new Promise<IAppPrayerTimes>(async (resolve) => {
            prayTimes.method = method
            const times = getTimes(loc)
            resolve(times)
        })
    }

    export function location(): Promise<LatLng> {
        return new Promise<LatLng>((resolve) => {
            navigator.geolocation.getCurrentPosition((pos) => {
                const loc: CoordinatesTuple = [pos.coords.latitude, pos.coords.longitude]
                resolve(loc)
            }, async () => {
                const data = await ky
                    .post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${__GMAPS_API_KEY__}`)
                    .json<{ location: { lat: number; lng: number }, accuracy: number }>()
                const loc: CoordinatesTuple = [data.location.lat, data.location.lng]
                resolve(loc)
            }, { timeout: 2000 })
        })
    }
}
