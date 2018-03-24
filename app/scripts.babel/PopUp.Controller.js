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

    let loadPage = function () {
        bptData.hourFormat().then(format => {
            $scope.format = format;
            $q.all([bptData.times(format), bptData.notifications()]).then(data => {
                let times = data[0];
                notify = data[1];
                $scope.fajr = Object.assign($scope.fajr, {
                    'value': times.fajr,
                    'notify': notify.fajr
                });
                $scope.imsak = Object.assign($scope.imsak, {
                    'value': times.imsak,
                    'notify': notify.imsak
                });
                $scope.sunrise = Object.assign($scope.sunrise, {
                    'value': times.sunrise,
                    'notify': notify.sunrise
                });
                $scope.dhuhr = Object.assign($scope.dhuhr, {
                    'value': times.dhuhr,
                    'notify': notify.dhuhr
                });
                $scope.asr = Object.assign($scope.asr, {
                    'value': times.asr,
                    'notify': notify.asr
                });
                $scope.maghrib = Object.assign($scope.maghrib, {
                    'value': times.maghrib,
                    'notify': notify.maghrib
                });
                $scope.isha = Object.assign($scope.isha, {
                    'value': times.isha,
                    'notify': notify.isha
                });
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
        });
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
            bptData.notifications(notify).then(() => loadPage());
        }
    };

    $scope.methodKey = bptI18n.method.title;
    $scope.formatKey = bptI18n.format.title;
    $scope.methods = prayTimes.methods;
    $scope.methodChanged = function () {
        bptData.method($scope.method).then(() => loadPage());
    };
    $scope.formatChanged = function () {
        bptData.hourFormat($scope.format).then(() => loadPage());
    };
}]);