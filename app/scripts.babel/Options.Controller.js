bptimes.controller('options', ['$scope', 'bptData', function ($scope, bptData) {

    $scope.notify = true;
    $scope.locale = bptData.language();
    $scope.supportedLocales = bptData.allLanguages;

    $scope.notifications = bptData.i18n.notifications.title;
    $scope.language = bptData.i18n.language.title;

    bptData.notify().then(function (val) {
        $scope.notify = val;
    });

    $scope.notifyChange = function () {
        bptData.notify($scope.notify).then(function (data) {

        });
    };

    $scope.localeChange = function () {
        bptData.language($scope.locale);
    };
}]);