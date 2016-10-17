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
angular.module('voxity.devices').provider('vxtDeviceConf', [function () {
    
    // interva to refresh list (in secondes)
    this.refreshListInterval = 7;    //seccondes

    this.autoRefreshList = true;

    this.startPath = '/devices';

    this.$get = [function() {
        return {
            'refreshListInterval': this.refreshListInterval,
            'autoRefreshList': this.autoRefreshList,
            'startPath': this.startPath
        };
    }];
}])
