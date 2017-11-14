bptimes.service('bptData', ['$q', function ($q) {

    let dataService = new DataService();
    let i18nService = new I18nService(dataService);

    this.dataService = dataService;

    this.times = function () {
        let q = $q.defer();
        dataService.times().then(function (data) {
            q.resolve(data);
        }).catch(function () {
            q.reject();
        });
        return q.promise;
    }

    this.language = function (lang) {
        if (typeof(lang) === 'undefined') {
            return i18nService.locale;
        } else {
            i18nService.locale = lang;
        }
    }

    this.notify = function (yesno) {
        let q = $q.defer();
        dataService.notify(yesno).then(function (data) {
            q.resolve(data);
        }).catch(function () {
            q.reject();
        });
        return q.promise;
    }

    this.allLanguages = I18nService.supportedLocales;

    this.i18n = i18nService;
}]);