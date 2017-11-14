class I18nService {

    constructor(dataService) {
        this._dataService = dataService;
        this._customizeLocale = function(locale) {
            $.getJSON(chrome.runtime.getURL('_locales/' + locale + '/messages.json')).done(function(data) {
                this._messages = (data);
                this._systemLocale = false;
            }.bind(this)).fail(function() {
                this._systemLocale = true;
            }.bind(this));
        }.bind(this);

        this._getMessage = function(key, messageKey) {
            let message = {};
            if (this._systemLocale || typeof(this._systemLocale) === 'undefined') {
                message['title'] = chrome.i18n.getMessage(key);
                if (typeof(messageKey) !== 'undefined') {
                    message['message'] = chrome.i18n.getMessage(messageKey);
                }
                return message;
            }
            if (typeof(messageKey) !== 'undefined') {
                message['message'] = this._messages[messageKey].message;
            }
            message['title'] = this._messages[key].message;
            return message;
        }.bind(this);

        this._dataService.language().then(function(lang, systemLocale){
            this._locale = lang;
            this._systemLocale = systemLocale;
            if(!this._systemLocale) {
                this._customizeLocale(this._locale);
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
        return this._getMessage('fajr', 'fajrNotification');
    }

    get shrouk() {
        return this._getMessage('shrouk', 'shroukNotification');
    }

    get dhor() {
        return this._getMessage('dhor', 'dhorNotification');
    }

    get maghreb() {
        return this._getMessage('maghreb', 'maghrebNotification');
    }

    get header () {
        return this._getMessage('header');
    }

    get options() {
        return this._getMessage('options');
    }

    get notifications () {
        return this._getMessage('notifications');
    }

    get language() {
        return this._getMessage('language');
    }
}