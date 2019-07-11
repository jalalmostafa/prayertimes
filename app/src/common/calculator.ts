import ky from 'ky'
import moment from 'moment'

import prayTimes, { CoordinatesTuple, DateTuple, IPrayerTimes, MethodType } from './prayer-times'

export interface IAppPrayerTimes extends IPrayerTimes {
    date: string
}

export namespace calculator {

    function getTimes(loc: CoordinatesTuple): IAppPrayerTimes {
        const dateArray: DateTuple = [moment().year(), moment().month(), moment().date()]
        return {
            ...prayTimes.getTimes(new Date(), loc, prayTimes.getTimeZone(dateArray), 'auto'),
            date: moment().format('YYYY-MM-DD'),
        } as IAppPrayerTimes
    }

    export function prayerTimes(method: MethodType): Promise<IAppPrayerTimes> {
        return new Promise<IAppPrayerTimes>((resolve) => {
            prayTimes.method = method

            navigator.geolocation.getCurrentPosition((pos) => {
                const loc: CoordinatesTuple = [pos.coords.latitude, pos.coords.longitude]
                resolve(getTimes(loc))
            }, async () => {
                const data = await ky
                    .post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDwz8JXCM_GkBHLyWFjDUVQHljGboVxHpw')
                    .json<{ location: { lat: number; lng: number }, accuracy: number }>()
                const loc: CoordinatesTuple = [data.location.lat, data.location.lng]
                resolve(getTimes(loc))
            }, { timeout: 2000 })
        })
    }
}
