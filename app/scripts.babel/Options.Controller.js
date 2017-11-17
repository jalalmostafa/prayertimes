bptimes.controller('options', ['$scope', 'bptData', function ($scope, bptData) {

    $scope.notify = true;

    $scope.notifications = bptData.i18n.notifications.title;

    bptData.notify().then(function (val) {
        $scope.notify = val;
    });

    $scope.notifyChange = function () {
        bptData.notify($scope.notify).then(function (data) {

        });
    };
}]);