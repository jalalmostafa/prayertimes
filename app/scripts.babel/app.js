let bptimes = angular.module('bptimes', ['ngRoute']);

bptimes.config(function ($routeProvider) {
    $routeProvider.when('/', {
        'templateUrl': '../PopUp.Template.html',
        'controller': 'popup'
    }).when('/opts', {
        'templateUrl': '../Options.Template.html',
        'controller': 'options'
    });
});

bptimes.run([
    '$rootScope',
    function ($rootScope) {
        // see what's going on when the route tries to change
        // $rootScope.$on('$routeChangeStart', function (event, next, current) {
        //     // next is an object that is the route that we are starting to go to
        //     // current is an object that is the route where we are currently
        //     var currentPath = current.originalPath;
        //     var nextPath = next.originalPath;

        //     console.log('Starting to leave %s to go to %s', currentPath, nextPath);
        // });
        $rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
            // both newUrl and oldUrl are strings
            console.log('Starting to leave %s to go to %s', oldUrl, newUrl);
        });


    }
]);
// let when = new Date();
// when.setMinutes(39);
// chrome.alarms.create('test', { 'when': when });
// chrome.alarms.onAlarm.addListener(function (alarm) {
//     alert("Got an alarm!", alarm);

// });