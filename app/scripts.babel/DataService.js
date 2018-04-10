class DataService {

    times(method, format) {
        let q = $.Deferred();
        const boundMethod = this.method.bind(this);
        chrome.storage.local.get(['times', 'format', 'method'], function (l) {
            console.log('data', format);
            if ('times' in l && l.times.date == moment().format('YYYY-MM-DD') &&
                (l.format == format || typeof (format) === 'undefined') &&
                (l.method == method || typeof (method) === 'undefined')) {
                console.log('old0');
                q.resolve(l.times);
            } else {
                const formatString = format ? '12hNS' : '24h';
                console.log('new', format);
                new CalculationProvider().times(method, formatString).then((data) => {
                    chrome.storage.local.set({
                        'times': data,
                        'format': format,
                        'method': method
                    }, () => {
                        q.resolve(data);
                    });
                }).catch(() => {
                    q.reject();
                });
            }
        });

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
                chrome.storage.local.set(obj, () => {
                    q.resolve(obj[fieldName]);
                });
            }
        });
        return q.promise();
    }
}