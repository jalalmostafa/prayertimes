class I18nService {

    constructor() {
        this._getMessage = (key, messageKey) => {
            let message = {};

            message['title'] = chrome.i18n.getMessage(key);
            if (typeof (messageKey) !== 'undefined') {
                message['message'] = chrome.i18n.getMessage(messageKey);
            }
            return message;
        }
    }

    get locale() {
        return this._locale;
    }

    get fajr() {
        return this._getMessage('fajr', 'fajrNotification');
    }

    get shrouk() {
        return this._getMessage('shrouk', 'shroukNotification');
    }

    get dhor() {
        return this._getMessage('dhor', 'dhorNotification');
    }

    get maghreb() {
        return this._getMessage('maghreb', 'maghrebNotification');
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
}