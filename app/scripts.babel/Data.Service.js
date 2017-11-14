bptimes.service('bptData', ['$q', function ($q) {

    let dataService = new DataService();
    let i18n = new I18nService(dataService);

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
        // let q = $q.defer();
        // dataService.language(lang).then(function (data) {
        //     q.resolve(data);
        // }).catch(function () {
        //     q.reject();
        // });
        // return q.promise;
        if (typeof(lang) === 'undefined') {
            return i18n.locale;
        } else {
            i18n.locale = lang;
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
}]);