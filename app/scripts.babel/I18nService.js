class I18nService {

    constructor() {
        this._getMessage = (key, messageKey) => {
            let message = {};

            message['title'] = chrome.i18n.getMessage(key);
            if (typeof (messageKey) !== 'undefined') {
                message['message'] = chrome.i18n.getMessage(messageKey);
            }
            return message;
        };
    }

    get locale() {
        return this._locale;
    }

    get fajr() {
        return this._getMessage('fajr', 'fajrNotification');
    }

    get imsak() {
        return this._getMessage('imsak', 'imsakNotification');
    }

    get sunrise() {
        return this._getMessage('sunrise', 'sunriseNotification');
    }

    get dhuhr() {
        return this._getMessage('dhuhr', 'dhuhrNotification');
    }

    get asr() {
        return this._getMessage('asr', 'asrNotification');
    }

    get maghrib() {
        return this._getMessage('maghrib', 'maghribNotification');
    }

    get isha() {
        return this._getMessage('isha', 'ishaNotification');
    }

    get header() {
        return this._getMessage('header');
    }

    get options() {
        return this._getMessage('options');
    }

    get notifications() {
        return this._getMessage('notifications');
    }

    get language() {
        return this._getMessage('language');
    }

    get notificationsMessage() {
        return this._getMessage('notificationsMessage');
    }

    get updateMessage() {
        return this._getMessage('updateMessage');
    }

    get fixMessage() {
        return this._getMessage('fixMessage');
    }

    get format() {
        return this._getMessage('format');
    }

    get method() {
        return this._getMessage('method');
    }
}