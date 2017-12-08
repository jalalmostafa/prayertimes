'use strict';

let playDefaultSound = function () {
    let audio = new Audio();
    audio.src = '../assets/solemn.mp3';
    audio.play();
};

let onInstallUpdate = function (msg, header) {
    chrome.notifications.create('onInstalled', {
        'type': 'basic',
        'iconUrl': 'images/small-mosque.png',
        'title': header,
        'message': msg
    }, function () {
        playDefaultSound();
    });
};

let data = new DataService();
let i18n = new I18nService();
let alarms = new AlarmService(function (alarm) {
    chrome.notifications.create(alarm.name, {
        'type': 'basic',
        'iconUrl': 'images/adhan-call.png',
        'title': alarm.title,
        'message': alarm.message
    }, function () {
        playDefaultSound();
    });
});

data.times().then(function (times) {
    data.notify().then(function (notify) {
        if (notify) {
            let now = moment();
            if (!now.isAfter(times.fajr)) {
                alarms.create('fajrAlarm', moment(times.fajr).unix() * 1000, i18n.fajr.title, i18n.fajr.message);
            }
            if (!now.isAfter(times.shrouk)) {
                alarms.create('shroukAlarm', moment(times.shrouk).unix() * 1000, i18n.shrouk.title, i18n.shrouk.message);
            }
            if (!now.isAfter(times.dhor)) {
                alarms.create('dhorAlarm', moment(times.dhor).unix() * 1000, i18n.dhor.title, i18n.dhor.message);
            }
            if (!now.isAfter(times.maghreb)) {
                alarms.create('maghrebAlarm', moment(times.maghreb).unix() * 1000, i18n.maghreb.title, i18n.maghreb.message);
            }
        }
    });
});

chrome.runtime.onInstalled.addListener(function (details) {
    let i18n = new I18nService();
    if (details.reason) {
        switch (details.reason) {
            case 'install':
                onInstallUpdate(i18n.notificationsMessage.title, i18n.header.title);
                break;
            case 'update':
                onInstallUpdate(i18n.fixMessage.title, i18n.header.title);
                break;
            default:
                break;
        }
    }
});