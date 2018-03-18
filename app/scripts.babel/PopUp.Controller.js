bptimes.controller('popup', ['$scope', 'bptData', '$q', function ($scope, bptData, $q) {
    $scope.methods = prayTimes.methods;
    let notify;

    let process = function () {
        $q.all([bptData.times(), bptData.hourFormat(), bptData.notifications()]).then(function (data) {
            let times = data[0];
            notify = data[2];
            $scope.format = data[1];

            $scope.fajr = {
                'key': bptData.i18n.fajr.title,
                'value': times.fajr,
                'notify': notify.fajr
            };
            $scope.imsak = {
                'key': bptData.i18n.imsak.title,
                'value': times.imsak,
                'notify': notify.imsak
            };
            $scope.sunrise = {
                'key': bptData.i18n.sunrise.title,
                'value': times.sunrise,
                'notify': notify.sunrise
            };
            $scope.dhuhr = {
                'key': bptData.i18n.dhuhr.title,
                'value': times.dhuhr,
                'notify': notify.dhuhr
            };
            $scope.asr = {
                'key': bptData.i18n.asr.title,
                'value': times.asr,
                'notify': notify.asr
            };
            $scope.maghrib = {
                'key': bptData.i18n.maghrib.title,
                'value': times.maghrib,
                'notify': notify.maghrib
            };
            $scope.isha = {
                'key': bptData.i18n.isha.title,
                'value': times.isha,
                'notify': notify.isha
            };
        });
    };

    $scope.header = bptData.i18n.header.title;

    process();

    bptData.method().then(function (method) {
        if (method) {
            $scope.method = method;
        }
    });

    $scope.notificationsKey = bptData.i18n.notifications.title;
    $scope.methodKey = bptData.i18n.method.title;
    $scope.formatKey = bptData.i18n.format.title;

    $scope.notifyChanged = function (notifyField) {
        if (notify) {
            notify[notifyField] = !!!notify[notifyField];
            bptData.notifications(notify).then(process);
        }
    };

    $scope.formatChanged = function () {
        bptData.hourFormat($scope.format).then(process);
    };

    $scope.methodChanged = function () {
        bptData.method($scope.method).then(process);
    };
}]);