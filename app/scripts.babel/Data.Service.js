bptimes.service('bptData', ['$q', function ($q) {

    let dataService = new DataService();

    this.times = function (format) {
        let q = $q.defer();
        dataService.times(format)
            .then((times) => q.resolve(times))
            .catch(() => q.reject());
        return q.promise;
    };

    this.hourFormat = function (format) {
        let q = $q.defer();
        dataService.hourFormat(format)
            .then(f => q.resolve(f))
            .catch(() => q.reject());
        return q.promise;
    };

    this.method = function (method) {
        let q = $q.defer();
        dataService.method(method)
            .then(m => q.resolve(m))
            .catch(() => q.reject());
        return q.promise;
    };

    this.notifications = function (notifications) {
        let q = $q.defer();
        dataService.notifications(notifications)
            .then(n => q.resolve(n))
            .catch(() => q.reject());
        return q.promise;
    };
}]);