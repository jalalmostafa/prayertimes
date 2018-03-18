class DataService {

    times() {
        let q = $.Deferred();
        let boundMethod = this.method.bind(this);
        let boundFormat = this.hourFormat.bind(this);

        $.when(boundMethod(), boundFormat())
            .then(function (method, format) {
                format = format ? '12hNS' : '24h';
                new CalculationProvider().times(method, format).then(q.resolve).catch(q.reject);
            }, q.reject);

        return q.promise();
    }

    hourFormat(format) {
        return this._field(format, 'format', false);
    }

    method(method) {
        return this._field(method, 'method', 'Tehran');
    }

    notifications(notifications) {
        return this._field(notifications, 'notifications', {
            'fajr': true,
            'imsak': true,
            'sunrise': false,
            'dhuhr': true,
            'asr': false,
            'maghrib': true,
            'isha': false
        });
    }

    _field(field, fieldName, defaultValue) {
        let q = $.Deferred();
        chrome.storage.local.get(fieldName, function (l) {
            if (typeof (field) === 'undefined') {
                q.resolve(l[fieldName] || defaultValue);
            } else {
                let obj = {};
                obj[fieldName] = field;
                chrome.storage.local.set(obj, q.resolve);
            }
        });
        return q.promise();
    }
}