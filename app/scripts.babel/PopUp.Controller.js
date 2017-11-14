bptimes.controller('popup', ['$scope', 'bptData', function($scope, bptData) {
    
    let i18n = new I18nService(bptData.dataService);

    let dateToHourString = function(date){
        return DateTime.toHoursMinutes(date);
    }
    
    bptData.times().then(function(times) {
        $scope.fajr = {'key': i18n.fajr.title, 'value': dateToHourString(times.fajr) };
        $scope.shrouk = {'key': i18n.shrouk.title, 'value': dateToHourString(times.shrouk) };
        $scope.dhor = {'key': i18n.dhor.title, 'value': dateToHourString(times.dhor) };
        $scope.maghreb = {'key': i18n.maghreb.title, 'value': dateToHourString(times.maghreb) };
    }, function() {
    });
    
}]);