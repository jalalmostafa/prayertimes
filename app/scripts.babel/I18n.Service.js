bptimes.service('bptI18n', function () {

    const getMessage = function (key, messageKey) {
        let message = {};
        message['title'] = chrome.i18n.getMessage(key);
        if (typeof (messageKey) !== 'undefined') {
            message['message'] = chrome.i18n.getMessage(messageKey);
        }
        return message;
    };

    this.fajr = getMessage('fajr', 'fajrNotification');

    this.imsak = getMessage('imsak', 'imsakNotification');

    this.sunrise = getMessage('sunrise', 'sunriseNotification');

    this.dhuhr = getMessage('dhuhr', 'dhuhrNotification');

    this.asr = getMessage('asr', 'asrNotification');

    this.maghrib = getMessage('maghrib', 'maghribNotification');

    this.isha = getMessage('isha', 'ishaNotification');

    this.header = getMessage('header');

    this.options = getMessage('options');

    this.notifications = getMessage('notifications');

    this.notificationsMessage = getMessage('notificationsMessage');

    this.updateMessage = getMessage('updateMessage');

    this.fixMessage = getMessage('fixMessage');

    this.format = getMessage('format');

    this.method = getMessage('method');
});