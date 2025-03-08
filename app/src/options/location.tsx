import { useEffect, useState } from 'react'

import { i18n } from '../common/i18n-service'
import { store, Place } from '../common/store'
import { Autocomplete } from '../components'
import { GoogleMapsPlaces } from '../common/google-maps-places'

export function Location() {
    const googleApi = new GoogleMapsPlaces(__GMAPS_API_KEY__)

    const [place, setPlace] = useState<Place>()
    useEffect(() => {
        const wrapper = async () => {
            const place = await store.place()
            setPlace(place)
        }
        wrapper()
    }, [])

    const fetchCities = async (input: string): Promise<Place[]> => {
        return await googleApi.autoCompleteCity(input)
    }

    const userSelect = async (choice: Place) => {
        choice.location = await googleApi.location(choice.placeId)
        await store.place(choice)
        setPlace(choice)
        await store.notifyBackground()
    }

    return (
        <div className="option-container">
            <span className="option-label-wrapper">
                <span className="option-label">{i18n.location}</span>
                <span className="option-desc">{i18n.locationDesc}</span>
            </span>
            <div className="option-control">
                <Autocomplete<Place>
                    initialValue={place}
                    debounce={300}
                    fetchElements={fetchCities}
                    onUserSelect={userSelect}
                />
            </div>
        </div >
    )
}
