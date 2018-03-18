bptimes.service('bptData', ['$q', function ($q) {

    let dataService = new DataService();
    let i18nService = new I18nService();

    this.times = function () {
        let q = $q.defer();
        dataService.times().then(q.resolve).catch(q.reject);
        return q.promise;
    };

    this.hourFormat = function (format) {
        let q = $q.defer();
        dataService.hourFormat(format).then(q.resolve).catch(q.reject);
        return q.promise;
    };

    this.i18n = i18nService;

    this.method = function (method) {
        let q = $q.defer();
        dataService.method(method).then(q.resolve).catch(q.reject);
        return q.promise;
    };

    this.notifications = function (notifications) {
        let q = $q.defer();
        dataService.notifications(notifications).then(q.resolve).catch(q.resolve);
        return q.promise;
    };
}]);