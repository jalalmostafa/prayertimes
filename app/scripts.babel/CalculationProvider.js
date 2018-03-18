class CalculationProvider {

    constructor(position) {
        this.position = position;
    }

    times(method, format) {
        let q = $.Deferred();
        let boundTimezone = this._timezone.bind(this);
        prayTimes.setMethod(method);
        navigator.geolocation.getCurrentPosition(function (pos) {
            let loc = [pos.coords.longitude, pos.coords.latitude, pos.coords.altitude];
            let times = prayTimes.getTimes(new Date(), loc, boundTimezone(), 'auto', format);
            q.resolve(times);
        }, q.reject);
        return q.promise();
    }

    _timezone() {
        return new Date().getTimezoneOffset() / -60;
    }
}