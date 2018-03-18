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

chrome.runtime.onInstalled.addListener(function (details) {
    let i18n = new I18nService();
    if (details.reason) {
        switch (details.reason) {
            case 'install':
                onInstallUpdate(i18n.notificationsMessage.title + 'Dev.', i18n.header.title);
                break;
            case 'update':
                // onInstallUpdate(i18n.fixMessage.title, i18n.header.title);
                break;
            default:
                break;
        }
    }
});

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
let run = function () {
    $.when(data.times(), data.notifications(), data.hourFormat()).then(function (times, notifications, format) {
        format = format ? 'h:mm' : 'HH:mm';
        let now = moment();
        if (!now.isAfter(moment(times.fajr, format)) && notifications.fajr) {
            alarms.create('fajrAlarm', moment(times.fajr).unix() * 1000, i18n.fajr.title, i18n.fajr.message);
        }
        if (!now.isAfter(moment(times.imsak, format)) && notifications.imsak) {
            alarms.create('imsakAlarm', moment(times.imsak).unix() * 1000, i18n.imsak.title, i18n.imsak.message);
        }
        if (!now.isAfter(moment(times.sunrise, format)) && notifications.sunrise) {
            alarms.create('shroukAlarm', moment(times.sunrise).unix() * 1000, i18n.sunrise.title, i18n.sunrise.message);
        }
        if (!now.isAfter(moment(times.dhuhr, format)) && notifications.dhuhr) {
            alarms.create('dhuhrAlarm', moment(times.dhuhr).unix() * 1000, i18n.dhuhr.title, i18n.dhuhr.message);
        }
        if (!now.isAfter(moment(times.asr, format)) && notifications.asr) {
            alarms.create('asrAlarm', moment(times.asr).unix() * 1000, i18n.asr.title, i18n.asr.message);
        }
        if (!now.isAfter(moment(times.maghrib, format)) && notifications.maghrib) {
            alarms.create('maghribAlarm', moment(times.maghrib).unix() * 1000, i18n.maghrib.title, i18n.maghrib.message);
        }
        if (!now.isAfter(moment(times.isha, format)) && notifications.isha) {
            alarms.create('maghrebAlarm', moment(times.isha).unix() * 1000, i18n.isha.title, i18n.isha.message);
        }
    });
    let tomorrow = Math.ceil((moment().add(1, 'days').startOf('day').unix() - moment().unix()) * 1e3);
    setTimeout(run, tomorrow);
};

run();