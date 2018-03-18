class AlarmService {

    constructor(callback) {
        this._alarms = {};
        this.setTimeout = window.setTimeout.bind(window);
        this.clearTimeout = window.clearTimeout.bind(window);
        this._callback = callback || function () {};
    }

    create(alarmName, when, title, message) {
        this._alarms[alarmName] = {
            'title': title + ' *********Dev. ',
            'message': message
        };
        this._alarms.timeout = this.setTimeout(this._callback, Math.ceil(when - (moment().unix() * 1e3)), this._alarms[alarmName]);
    }

    clear(alarmName) {
        this.clearTimeout(this._alarms[alarmName].timeout);
        delete this._alarms[alarmName];
    }

    clearAll() {
        Object.keys(this._alarms).map(key => this.clear(key));
    }

    get(alarmName) {
        return this._alarms[alarmName];
    }
}