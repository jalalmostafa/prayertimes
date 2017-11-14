class DataService {

    constructor() {
    }

    times() {
        let q = $.Deferred();   
        chrome.storage.local.get('times', function(l) {
            if('times' in l && l.times.date == DateTime.today) {
                q.resolve(l.times);
            } else {
                // update data. get from internet -> update cache and latest -> return new data
                new AlManarProvider().times().then(function(data) {
                    chrome.storage.local.set({'times': data}, function() {});
                    q.resolve(data);
                }).catch(function() {
                    q.reject();
                });
            }
        });
        return q.promise();
    }

    language(lang) {
        let q = $.Deferred();
        chrome.storage.local.get('language', function (l) {
            if (typeof (lang) === 'undefined') {
                if ('language' in l) {
                    q.resolve(l.language, true);
                } else {
                    q.resolve(chrome.i18n.getMessage('symbol'), true);
                }
            } else {
                let mappedLocales = I18nService.supportedLocales.map(v => v.symbol);
                if (mappedLocales.indexOf(lang) > -1) {
                    chrome.storage.local.set({ 'language': lang }, function(){
                        q.resolve(lang, false);
                    });
                } else {
                    q.reject();
                }
            }
        });
        return q.promise();
    }

    notify() {
        let q = $.Deferred();
        chrome.storage.local.get('notifications', function (l) {
            if(typeof (yesno) === 'undefined') {
                if('notifications' in l) {
                    q.resolve(l.notifications);        
                } else {
                    q.resolve(true);
                }
            } else {
                if (typeof (yesno) === 'boolean') {
                    chrome.storage.local.set({ 'notifications': yesno }, q.resolve);
                } else {
                    q.reject();
                }
            }
        });
        return q.promise();
    }
}