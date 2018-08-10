'use strict';
const playDefaultSound = function () {
    const audio = new Audio();
    audio.src = '../assets/solemn.mp3';
    audio.play();
};

const Messages = {
    'fajr': {
        title: chrome.i18n.getMessage('fajr'),
        message: chrome.i18n.getMessage('fajrNotification')
    },
    'imsak': {
        title: chrome.i18n.getMessage('imsak'),
        message: chrome.i18n.getMessage('imsakNotification')
    },
    'sunrise': {
        title: chrome.i18n.getMessage('sunrise'),
        message: chrome.i18n.getMessage('sunriseNotification')
    },
    'dhuhr': {
        title: chrome.i18n.getMessage('dhuhr'),
        message: chrome.i18n.getMessage('dhuhrNotification')
    },
    'asr': {
        title: chrome.i18n.getMessage('asr'),
        message: chrome.i18n.getMessage('asrNotification')
    },
    'maghrib': {
        title: chrome.i18n.getMessage('maghrib'),
        message: chrome.i18n.getMessage('maghribNotification')
    },
    'isha': {
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

const createAlarm = function (alarmName, momentObj) {
    const when = momentObj.unix();
    chrome.alarms.create(alarmName, {
        'when': when * 1000
    });
};

const run = function () {
    const data = new DataService();
    $.when(data.times(), data.notifications(), data.hourFormat()).then((times, notifications, format) => {
        format = format ? 'h:mm A' : 'HH:mm';
        const now = moment();
        const formattedFajr = moment(times.fajr, format);
        const formattedImsak = moment(times.imsak, format);
        const formattedSunrise = moment(times.sunrise, format);
        const formattedDhuhr = moment(times.dhuhr, format);
        const formattedAsr = moment(times.asr, format);
        const formattedMaghrib = moment(times.maghrib, format);
        const formattedIsha = moment(times.isha, format);

        if (!now.isAfter(formattedFajr) && notifications.fajr) {
            createAlarm('fajr', formattedFajr);
        }
        if (!now.isAfter(formattedImsak) && notifications.imsak) {
            createAlarm('imsak', formattedImsak);
        }
        if (!now.isAfter(formattedSunrise) && notifications.sunrise) {
            createAlarm('sunrise', formattedSunrise);
        }
        if (!now.isAfter(formattedDhuhr) && notifications.dhuhr) {
            createAlarm('dhuhr', formattedDhuhr);
        }
        if (!now.isAfter(formattedAsr) && notifications.asr) {
            createAlarm('asr', formattedAsr);
        }
        if (!now.isAfter(formattedMaghrib) && notifications.maghrib) {
            createAlarm('maghrib', formattedMaghrib);
        }
        if (!now.isAfter(formattedIsha) && notifications.isha) {
            createAlarm('isha', formattedIsha);
        }
    });

    const tomorrow = moment().add(1, 'days').startOf('day');
    createAlarm('tomorrow', tomorrow);
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

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason) {
        switch (details.reason) {
            case 'install':
                onInstallUpdate(Messages.notificationsMessage.title, Messages.header.title);
                break;
            case 'update':
                chrome.storage.local.clear();
                // onInstallUpdate(Messages.fixMessage.title, Messages.header.title);
                break;
            default:
                break;
        }
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name == 'tomorrow') {
        run();
    } else {
        const data = new DataService();
        const alarmData = Messages[alarm.name];
        const now = moment();
        data.times().then((times) => {
            const deadline = moment(times[alarm.name], 'HH:mm').add(5, 'minutes');
            if (!now.isAfter(deadline)) {
                chrome.notifications.create(alarm.name, {
                    'type': 'basic',
                    'iconUrl': 'images/adhan-call.png',
                    'title': alarmData.title,
                    'message': alarmData.message,
                    'requireInteraction': true,
                }, () => {
                    playDefaultSound();
                });
            }
        });
    }
});