'use strict';

let data = new DataService();
let alarms = new AlarmService();
let i18n = new I18nService();

let playDefaultSound = function() {
    let audio = new Audio();
    audio.src = '../assets/solemn.mp3';
    audio.play();
};

chrome.runtime.onInstalled.addListener(function() {
    chrome.notifications.create('onInstalled', {
        'type': 'basic',
        'iconUrl': 'images/small-mosque.png',
        'title': i18n.header.title,
        'message': i18n.notificationsMessage.title
    }, function () {
        playDefaultSound();
    });
});

alarms.callback = function (alarm) {
    let alarmData = alarms.get(alarm.name);
    chrome.notifications.create(alarm.name, {
        'type': 'basic',
        'iconUrl': 'images/adhan-call.png',
        'title': alarmData.title,
        'message': alarmData.message
    }, function () {
        playDefaultSound();
    });

};

data.times().then(function (times) {
    data.notify().then(function(notify) {
        if(notify) {
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
