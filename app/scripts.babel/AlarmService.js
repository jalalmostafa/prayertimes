class AlarmService {

    constructor() {
        this._alarms = {};
    }

    set callback(callback) {
        chrome.alarms.onAlarm.addListener(callback);
    }

    create(alarmName, when, title, message) {
        chrome.alarms.create(alarmName, { 'when': when });
        this._alarms[alarmName] = {
            'title': title,
            'message': message
        }
    }

    clear(alarmName) {
        chrome.alarms.clear(alarmName);
    }
    
    clearAll() {
        chrome.alarms.clearAll();
    }

    all() {
        let q = $.Deferred();
        chrome.alarms.getAll(function(alarms) {
            q.resolve(alarms);
        });
        return q.promise();
    }

    get(alarmName) {
        return this._alarms[alarmName];
    }
}