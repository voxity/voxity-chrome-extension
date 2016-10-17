angular.module('voxity.devices', [
    'voxity.core',
    'voxity.channels',
    'voxity.users',
]);


angular.module('voxity.devices').config(['$routeProvider',
    function(rp) {
        rp.when('/devices/:phoneId', {
            templateUrl: 'views/devices/detail.html',
            controller: 'deviceCtrl'
        });
        rp.when('/devices', {
            templateUrl: 'views/devices/list.html',
            controller: 'devicesCtrl'
        })
    }
]);