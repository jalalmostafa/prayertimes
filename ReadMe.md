# Prayer Times

In-Browser Prayer Times and Notifications

Features:

- In-Browser Notifications
- Choose what you want to get notified for
- Choose your location manually
- A.M./P.M. and 24Hours format

## How to Build

Technology stack: React - TypeScript - Webpack

- Create `.env` file in root directory and set the following properties:

```bash
# Google Geolocation and Maps APIs
GMAPS_API_KEY=<your_google_maps_api_key_here>
```

- `yarn install`
- `yarn start`

## Credits

- [`app/src/common/prayer-times.ts`](https://github.com/jalalmostafa/chrome-prayertimes/blob/master/app/src/common/prayer-times.ts) is a a fork of Hamid Zarrabi-Zadeh's [`prayertimes.js`](http://praytimes.org/code/v2/js/PrayTimes.js) license under GNU LGPL v3.0
- Icons made by [Freepik](https://www.flaticon.com/authors/freepik) from [www.flaticon.com](www.flaticon.com)
