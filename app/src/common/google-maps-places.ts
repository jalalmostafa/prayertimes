import ky from 'ky'
import { i18n } from './i18n-service'
import { LatLng } from './calculator'

interface AutocompleteResponse {
    suggestions: {
        placePrediction: {
            placeId: string
            text: {
                text: string
                matches: any[]
            }
        }
    }[]
}

interface PlaceDetailsResponse {
    location: {
        latitude: number
        longitude: number
    }
}

export interface GoogleMapsCity {
    name: string
    placeId: string
}

export class GoogleMapsPlaces {
    constructor(readonly apiKey: string) {
    }

    private async autoComplete(input: string, includedPrimaryTypes?: string,): Promise<AutocompleteResponse> {
        const languageCode = i18n.languageCode;
        return await ky.post('https://places.googleapis.com/v1/places:autocomplete', {
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': this.apiKey,
                'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text'
            },
            json: { input, includedPrimaryTypes, languageCode, },
        }).json<AutocompleteResponse>()
    }

    async autoCompleteCity(input: string): Promise<GoogleMapsCity[]> {
        const resp = await this.autoComplete(input, '(cities)',)
        return resp.suggestions.map(c => {
            return {
                name: c.placePrediction.text.text,
                placeId: c.placePrediction.placeId,
            }
        })
    }

    async location(placesId: string): Promise<LatLng> {
        const loc = await ky.get(`https://places.googleapis.com/v1/places/${placesId}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': this.apiKey,
                'X-Goog-FieldMask': 'location'
            },
        }).json<PlaceDetailsResponse>()

        return [loc.location.latitude, loc.location.longitude]
    }
}