class AlManarProvider {

    times() {
        let q = $.Deferred();
        $.get('http://almanar.com.lb/legacy/salat.php').done(function (data) {
            let times = {};
            let htmlElm = $(data);
            times.fajr = DateTime.parseHoursMinutes(htmlElm.find('.sobh-t').text());
            times.shrouk = DateTime.parseHoursMinutes(htmlElm.find('.shorouk-t').text());
            times.dhor = DateTime.parseHoursMinutes(htmlElm.find('.dohr-t').text());
            times.maghreb = DateTime.parseHoursMinutes(htmlElm.find('.moghreb-t').text());
            times.fulldate = htmlElm.find('.full-date').text();
            times.date = DateTime.today;
            chrome.storage.local.set({ 'times': times }, function () { });
            q.resolve(times);
        }).fail(function () {
            q.reject();
        });
        return q.promise();
    }
}