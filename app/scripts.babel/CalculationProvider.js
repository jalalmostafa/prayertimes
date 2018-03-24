class CalculationProvider {

    times(method, format) {
        let getTimes = (loc) => {
            const tz = this._timezone();
            let _times = prayTimes.getTimes(new Date(), loc, tz, 'auto', format);
            _times.date = moment().format('YYYY-MM-DD');
            return _times;
        };
        let q = $.Deferred();
        prayTimes.setMethod(method);
        navigator.geolocation.getCurrentPosition(pos => {
            let loc = [pos.coords.latitude, pos.coords.longitude];
            q.resolve(getTimes(loc));
        }, (err) => {
            $.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDwz8JXCM_GkBHLyWFjDUVQHljGboVxHpw', (pos) => {
                const loc = [pos.location.lat, pos.location.lng];
                console.log(loc);
                q.resolve(getTimes(loc));
            }).catch(() => q.reject(JSON.stringify(err)));
        }, {
            timeout: 2000
        });
        return q.promise();
    }

    _timezone() {
        return new Date().getTimezoneOffset() / -60;
    }
}