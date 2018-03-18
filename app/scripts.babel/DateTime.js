class DateTime {
    static parseHoursMinutes(str) {
        return moment(str, 'HH:mm').format();
    }
    static get today() {
        return moment().format('YYYY-MM-DD');
    }
    static toHoursMinutes(date) {
        return moment(date).format('HH:mm');
    }
}