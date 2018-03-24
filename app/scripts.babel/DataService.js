class DataService {

    times(format) {
        let q = $.Deferred();
        const boundMethod = this.method.bind(this);
        format = format ? '12hNS' : '24h';
        chrome.storage.local.get('times', function (l) {
            if ('times' in l && l.times.date == moment().format('YYYY-MM-DD')) {
                q.resolve(l.times);
            } else {
                boundMethod().then(function (method) {
                    new CalculationProvider().times(method, format).then((data) => {
                        chrome.storage.local.set({
                            'times': data
                        }, (val) => {
                            q.resolve(data);
                        });
                    }).catch(() => {
                        q.reject();
                    });
                }).catch(() => q.reject());
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
                chrome.storage.local.set(obj, (val) => {
                    q.resolve(val);
                });
            }
        });
        return q.promise();
    }
}