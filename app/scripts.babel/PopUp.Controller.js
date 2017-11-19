bptimes.controller('popup', ['$scope', 'bptData', '$q', function ($scope, bptData, $q) {
    let times;

    let dateToHourString = function (date) {
        let hourFormat = $scope.format ? 'hh' : 'HH';
        return moment(date).format(hourFormat + ':mm');
    }

    let process = function () {
        $scope.fajr = {
            'key': bptData.i18n.fajr.title,
            'value': dateToHourString(times.fajr)
        };
        $scope.shrouk = {
            'key': bptData.i18n.shrouk.title,
            'value': dateToHourString(times.shrouk)
        };
        $scope.dhor = {
            'key': bptData.i18n.dhor.title,
            'value': dateToHourString(times.dhor)
        };
        $scope.maghreb = {
            'key': bptData.i18n.maghreb.title,
            'value': dateToHourString(times.maghreb)
        };
    }

    $scope.header = bptData.i18n.header.title;

    $q.all([bptData.times(), bptData.hourFormat()]).then(function (data) {
        times = data[0];
        $scope.format = data[1] || false;

        process();
    }, function () {});

    $scope.notify = true;

    $scope.notifications = bptData.i18n.notifications.title;

    bptData.notify().then(function (val) {
        $scope.notify = val;
    });

    $scope.notifyChange = function () {
        bptData.notify($scope.notify).then(function (data) {

        });
    };

    $scope.notifyFormatChange = function() {
        bptData.hourFormat($scope.format);
        process();
    }
}]);