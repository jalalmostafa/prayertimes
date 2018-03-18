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
        const formattedFajr = moment(times.fajr, format);
        const formattedImsak = moment(times.imsak, format);
        const formattedSunrise = moment(times.sunrise, format);
        const formattedDhuhr = moment(times.dhuhr, format);
        const formattedAsr = moment(times.asr, format);
        const formattedMaghrib = moment(times.maghrib, format);
        const formattedIsha = moment(times.isha, format);

        if (!now.isAfter(formattedFajr) && notifications.fajr) {
            alarms.create('fajrAlarm', formattedFajr.unix() * 1000, i18n.fajr.title, i18n.fajr.message);
        }
        if (!now.isAfter(formattedImsak) && notifications.imsak) {
            alarms.create('imsakAlarm', formattedImsak.unix() * 1000, i18n.imsak.title, i18n.imsak.message);
        }
        if (!now.isAfter(formattedSunrise) && notifications.sunrise) {
            alarms.create('shroukAlarm', formattedSunrise.unix() * 1000, i18n.sunrise.title, i18n.sunrise.message);
        }
        if (!now.isAfter(formattedDhuhr) && notifications.dhuhr) {
            alarms.create('dhuhrAlarm', formattedDhuhr.unix() * 1000, i18n.dhuhr.title, i18n.dhuhr.message);
        }
        if (!now.isAfter(formattedAsr) && notifications.asr) {
            alarms.create('asrAlarm', formattedAsr.unix() * 1000, i18n.asr.title, i18n.asr.message);
        }
        if (!now.isAfter(formattedMaghrib) && notifications.maghrib) {
            alarms.create('maghribAlarm', formattedMaghrib.unix() * 1000, i18n.maghrib.title, i18n.maghrib.message);
        }
        if (!now.isAfter(formattedIsha) && notifications.isha) {
            alarms.create('maghrebAlarm', formattedIsha.unix() * 1000, i18n.isha.title, i18n.isha.message);
        }
    });
    let tomorrow = Math.ceil((moment().add(1, 'days').startOf('day').unix() - moment().unix()) * 1e3);
    setTimeout(run, tomorrow);
};

run();