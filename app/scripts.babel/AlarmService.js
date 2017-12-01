class AlarmService {

    constructor() {
        this._alarms = {};
        this.setTimeout = window.setTimeout;
        this.clearTimeout = window.clearTimeout;
        this._callback = function () {};
    }

    set callback(callback) {
        this._callback = callback;
    }

    create(alarmName, when, title, message) {
        this._alarms[alarmName] = {
            'title': title,
            'message': message,
            'timeout': this.setTimeout(this._callback, when - (moment().unix()*1000))
        };
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