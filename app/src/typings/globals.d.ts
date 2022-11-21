
import * as React from 'react';

import GoogleMapReact, { Props } from 'google-map-react';

declare module 'google-map-react' {
    export interface Props {
        children: React.ReactNode;
    }
}

declare global {
    export var __GMAPS_API_KEY__: string;
}
