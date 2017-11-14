bptimes.controller('options', ['$scope', 'bptData', function($scope, bptData) {
    
    $scope.notify =  true;
    $scope.locale = bptData.language();
    $scope.supportedLocales = bptData.allLanguages;

    bptData.notify().then(function(val) {
        $scope.notify = val;
    });
    
    $scope.notifyChange = function() {
        bptData.language($scope.locale).then(function() {

        });
    };

    $scope.localeChange = function() {
        bptData.language($scope.locale);
    };
}]);