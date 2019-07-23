import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import GoogleMapReact, { ChildComponentProps, ClickEventValue } from 'google-map-react'
import React from 'react'

import { LatLng } from '../common/calculator'
import { i18n } from '../common/i18n-service'
import { store } from '../common/store'

interface ILocationState {
    center: LatLng
}

const mapOptions = {
    fullscreenControl: false,
}

export class Location extends React.Component<{}, ILocationState> {

    constructor(props: {}) {
        super(props)
        this.state = {
            center: [0, 0],
        }
    }

    mapClicked = async (e: ClickEventValue) => {
        const location = await store.location([e.lat, e.lng])
        this.setState({
            center: location,
        })
    }

    loadPage = async () => {
        const coords = await store.location()
        this.setState({
            center: coords,
        })
    }

    render() {
        const [lat, lng] = this.state.center
        return (
            <div className="location-picker">
                <label htmlFor="location" className="hour-format-label">{i18n.location}</label>
                <div className="location-desc">{i18n.locationDesc}</div>
                <div className="location-control" id="location">
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: __GMAPS_API_KEY__ }}
                        options={mapOptions}
                        zoom={10}
                        center={{ lat, lng }}
                        onClick={this.mapClicked}
                        onTilesLoaded={this.loadPage}
                    >
                        <LocationMarker lat={lat} lng={lng} />
                    </GoogleMapReact>
                </div>
            </div>
        )
    }
}

function LocationMarker(_props: ChildComponentProps): JSX.Element {
    return (
        <span>
            <FontAwesomeIcon className="location-marker" icon="map-marker-alt" />
        </span>
    )
}
