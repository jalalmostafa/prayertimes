class I18nService {
    constructor(dataService) {
        this._dataService = dataService;
        this._customizeLocale = function(locale) {
            $.get(chrome.runtime.getURL('_locales/' + locale + '/messages.json')).done(function(data) {
                this._messages = JSON.parse(data);
            }).fail(function() {
                this._systemLocale = true;
            });
        }.bind(this);
        this._dataService.language().then(function(lang, systemLocale){
            this._locale = lang;
            this._systemLocale = systemLocale;
            if(!this._systemLocale) {
                this._getCustomizedLocaleMessages(this._locale);
            }
        }.bind(this));
    }

    static get supportedLocales() {
        return [{
            'symbol': 'en',
            'title': 'English'
        }, {
            'symbol': 'ar',
            'title': 'العربية'
        }];
    }

    get locale() {
        return this._locale;
    }

    set locale(locale) {
        this._dataService.language(locale).then(function(){
            this._locale = locale;
            this._customizeLocale(locale);
        }.bind(this));
    }

    get fajr() {
        if (this._systemLocale || this._systemLocale === undefined) {
            return { 
                'title' : chrome.i18n.getMessage('fajr'),
                'message': chrome.i18n.getMessage('fajrNotification')
            };
        }
        return {
            'title' : this._messages.fajr.message,
            'message': this._messages.fajrNotification.message
        };
    }

    get shrouk() {
        if (this._systemLocale || this._systemLocale === undefined) {
            return { 
                'title' : chrome.i18n.getMessage('shrouk'),
                'message': chrome.i18n.getMessage('shroukNotification')
            };
        }
        return {
            'title' : this._messages.shrouk.message,
            'message': this._messages.shroukNotification.message
        };
    }

    get dhor() {
        if (this._systemLocale || this._systemLocale === undefined) {
            return { 
                'title' : chrome.i18n.getMessage('dhor'),
                'message': chrome.i18n.getMessage('dhorNotification')
            };
        }
        return {
            'title' : this._messages.dhor.message,
            'message': this._messages.dhorNotification.message
        };
    }

    get maghreb() {
        if (this._systemLocale || this._systemLocale === undefined) {
            return { 
                'title' : chrome.i18n.getMessage('maghreb'),
                'message': chrome.i18n.getMessage('maghrebNotification')
            };
        }
        return {
            'title' : this._messages.maghreb.message,
            'message': this._messages.maghrebNotification.message
        };
    } 
}