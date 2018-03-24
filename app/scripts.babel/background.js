'use strict';
const playDefaultSound = function () {
    const audio = new Audio();
    audio.src = '../assets/solemn.mp3';
    audio.play();
};

const Messages = {
    'fajrAlarm': {
        title: chrome.i18n.getMessage('fajr'),
        message: chrome.i18n.getMessage('fajrNotification')
    },
    'imsakAlarm': {
        title: chrome.i18n.getMessage('imsak'),
        message: chrome.i18n.getMessage('imsakNotification')
    },
    'shroukAlarm': {
        title: chrome.i18n.getMessage('sunrise'),
        message: chrome.i18n.getMessage('sunriseNotification')
    },
    'dhuhrAlarm': {
        title: chrome.i18n.getMessage('dhuhr'),
        message: chrome.i18n.getMessage('dhuhrNotification')
    },
    'asrAlarm': {
        title: chrome.i18n.getMessage('asr'),
        message: chrome.i18n.getMessage('asrNotification')
    },
    'maghribAlarm': {
        title: chrome.i18n.getMessage('maghrib'),
        message: chrome.i18n.getMessage('maghribNotification')
    },
    'ishaAlarm': {
        title: chrome.i18n.getMessage('isha'),
        message: chrome.i18n.getMessage('ishaNotification')
    },
    'header': {
        title: chrome.i18n.getMessage('header')
    },
    'options': {
        title: chrome.i18n.getMessage('options')
    },
    'notifications': {
        title: chrome.i18n.getMessage('notifications')
    },
    'notificationsMessage': {
        title: chrome.i18n.getMessage('notificationsMessage')
    },
    'updateMessage': {
        title: chrome.i18n.getMessage('updateMessage')
    },
    'fixMessage': {
        title: chrome.i18n.getMessage('fixMessage')
    },
    'format': {
        title: chrome.i18n.getMessage('format')
    },
    'method': {
        title: chrome.i18n.getMessage('method')
    }
};

const onInstallUpdate = function (msg, header) {
    chrome.notifications.create('onInstalled', {
        'type': 'basic',
        'iconUrl': 'images/small-mosque.png',
        'title': header,
        'message': msg
    }, () => {
        playDefaultSound();
    });
};

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason) {
        switch (details.reason) {
            case 'install':
                onInstallUpdate(Messages.notificationsMessage.title, Messages.header.title);
                break;
            case 'update':
                // onInstallUpdate(Messages.fixMessage.title, Messages.header.title);
                break;
            default:
                break;
        }
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    const alarmData = Messages[alarm.name];
    chrome.notifications.create(alarm.name, {
        'type': 'basic',
        'iconUrl': 'images/adhan-call.png',
        'title': alarmData.title + 'BETA',
        'message': alarmData.message,
        'requireInteraction': true,
    }, function () {
        playDefaultSound();
    });
});

const run = function () {
    const data = new DataService();
    $.when(data.times(), data.notifications(), data.hourFormat()).then((times, notifications, format) => {
        format = format ? 'h:mm' : 'HH:mm';
        const now = moment();
        const formattedFajr = moment(times.fajr, format);
        const formattedImsak = moment(times.imsak, format);
        const formattedSunrise = moment(times.sunrise, format);
        const formattedDhuhr = moment(times.dhuhr, format);
        const formattedAsr = moment(times.asr, format);
        const formattedMaghrib = moment(times.maghrib, format);
        const formattedIsha = moment(times.isha, format);

        if (!now.isAfter(formattedFajr) && notifications.fajr) {
            chrome.alarms.create('fajrAlarm', {
                'when': formattedFajr.unix() * 1000
            });
        }
        if (!now.isAfter(formattedImsak) && notifications.imsak) {
            chrome.alarms.create('imsakAlarm', {
                'when': formattedImsak.unix() * 1000
            });
        }
        if (!now.isAfter(formattedSunrise) && notifications.sunrise) {
            chrome.alarms.create('shroukAlarm', {
                'when': formattedSunrise.unix() * 1000
            });
        }
        if (!now.isAfter(formattedDhuhr) && notifications.dhuhr) {
            chrome.alarms.create('dhuhrAlarm', {
                'when': formattedDhuhr.unix() * 1000
            });
        }
        if (!now.isAfter(formattedAsr) && notifications.asr) {
            chrome.alarms.create('asrAlarm', {
                'when': formattedAsr.unix() * 1000
            });
        }
        if (!now.isAfter(formattedMaghrib) && notifications.maghrib) {
            chrome.alarms.create('maghribAlarm', {
                'when': formattedMaghrib.unix() * 1000
            });
        }
        if (!now.isAfter(formattedIsha) && notifications.isha) {
            chrome.alarms.create('ishaAlarm', {
                'when': formattedIsha.unix() * 1000
            });
        }
    });
    const tomorrow = moment().add(1, 'days').startOf('day').unix() * 1e3;
    const duration = Math.ceil((tomorrow - moment().unix() * 1e3) * 1e3);
    chrome.alarms.create('tomorrow', {
        'when': tomorrow
    });
};

run();

chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(msg => {
        if (msg.command === 'configChanged') {
            chrome.alarms.clearAll((wasCleared) => {
                wasCleared ? port.postMessage({
                    changed: true
                }) : port.postMessage({
                    changed: false
                });
                run();
            });
        }
    });
});