bptimes.controller('popup', ['$scope', 'bptData', function($scope, bptData) {

    let dateToHourString = function(date){
        return DateTime.toHoursMinutes(date);
    }

    $scope.header = bptData.i18n.header.title;
    $scope.options = bptData.i18n.options.title;
    $scope.arabic = bptData.language() == 'ar';
    bptData.times().then(function(times) {
        $scope.fajr = {'key': bptData.i18n.fajr.title, 'value': dateToHourString(times.fajr) };
        $scope.shrouk = {'key': bptData.i18n.shrouk.title, 'value': dateToHourString(times.shrouk) };
        $scope.dhor = {'key': bptData.i18n.dhor.title, 'value': dateToHourString(times.dhor) };
        $scope.maghreb = {'key': bptData.i18n.maghreb.title, 'value': dateToHourString(times.maghreb) };
    }, function() {
    });

}]);