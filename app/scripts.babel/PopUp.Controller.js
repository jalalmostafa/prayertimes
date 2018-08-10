bptimes.controller('popup', ['$scope', 'bptData', 'bptI18n', '$q', function ($scope, bptData, bptI18n, $q) {
    let notify;
    $scope.fajr = {
        'key': bptI18n.fajr.title
    };
    $scope.imsak = {
        'key': bptI18n.imsak.title
    };
    $scope.sunrise = {
        'key': bptI18n.sunrise.title
    };
    $scope.dhuhr = {
        'key': bptI18n.dhuhr.title
    };
    $scope.asr = {
        'key': bptI18n.asr.title
    };
    $scope.maghrib = {
        'key': bptI18n.maghrib.title
    };
    $scope.isha = {
        'key': bptI18n.isha.title
    };

    const reformat = function (time, format) {
        return !format ? time : moment(time, 'h:mm A').format('hh:mm A');;
    };

    const loadPage = function () {
        $q.all([bptData.times(), bptData.notifications(), bptData.hourFormat()]).then(data => {
            const times = data[0];
            const format = data[2];
            notify = data[1];
            $scope.format = format;
            console.log(format, times);
            $scope.fajr = Object.assign($scope.fajr, {
                'value': reformat(times.fajr, format),
                'notify': notify.fajr
            });
            $scope.imsak = Object.assign($scope.imsak, {
                'value': reformat(times.imsak, format),
                'notify': notify.imsak
            });
            $scope.sunrise = Object.assign($scope.sunrise, {
                'value': reformat(times.sunrise, format),
                'notify': notify.sunrise
            });
            $scope.dhuhr = Object.assign($scope.dhuhr, {
                'value': reformat(times.dhuhr, format),
                'notify': notify.dhuhr
            });
            $scope.asr = Object.assign($scope.asr, {
                'value': reformat(times.asr, format),
                'notify': notify.asr
            });
            $scope.maghrib = Object.assign($scope.maghrib, {
                'value': reformat(times.maghrib, format),
                'notify': notify.maghrib
            });
            $scope.isha = Object.assign($scope.isha, {
                'value': reformat(times.isha, format),
                'notify': notify.isha
            });
        });
    };

    const updateTimes = function (times, format) {
        $scope.fajr.value = reformat(times.fajr, format);
        $scope.imsak.value = reformat(times.imsak, format);
        $scope.sunrise.value = reformat(times.sunrise, format);
        $scope.dhuhr.value = reformat(times.dhuhr, format);
        $scope.asr.value = reformat(times.asr, format);
        $scope.maghrib.value = reformat(times.maghrib, format);
        $scope.isha.value = reformat(times.isha, format);
    };

    $scope.header = bptI18n.header.title;

    loadPage();

    bptData.method().then(function (method) {
        if (method) {
            $scope.method = method;
        }
    });

    $scope.notificationsKey = bptI18n.notifications.title;

    $scope.notifyChanged = function (notifyField) {
        if (notify) {
            notify[notifyField] = !!!notify[notifyField];
            bptData.notifications(notify).then(notifications => {
                console.log('notifications', notifications);
                $scope.fajr.notify = notifications.fajr;
                $scope.imsak.notify = notifications.imsak;
                $scope.sunrise.notify = notifications.sunrise;
                $scope.dhuhr.notify = notifications.dhuhr;
                $scope.asr.notify = notifications.asr;
                $scope.maghrib.notify = notifications.maghrib;
                $scope.isha.notify = notifications.isha;
            }).then(() => {
                const port = chrome.runtime.connect({
                    name: 'bptBackground'
                });
                if (port) {
                    port.postMessage({
                        command: 'configChanged'
                    });
                }
            });
        }
    };

    $scope.methodKey = bptI18n.method.title;
    $scope.formatKey = bptI18n.format.title;
    $scope.methods = prayTimes.methods;

    $scope.methodChanged = function () {
        bptData.times($scope.method, $scope.format).then(times => {
            updateTimes(times, $scope.format);
        }).then(() => {
            const port = chrome.runtime.connect({
                name: 'bptBackground'
            });
            if (port) {
                port.postMessage({
                    command: 'configChanged'
                });
            }
        });
    };

    $scope.formatChanged = function () {
        const format = $scope.format;
        bptData.times($scope.method, format).then(times => {
            updateTimes(times, format);
        });
    };
}]);