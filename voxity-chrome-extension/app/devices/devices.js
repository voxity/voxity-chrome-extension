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

angular.module('voxity.devices').provider('vxtDeviceConf', [function() {
    
    /**
     * Auto refresh list of device in device list
     * @type {Boolean}
     */
    this.autoRefreshList = false;

    /**
     * interval to refresh list (in secondes) in Téléphone page **(min = 5Second)** **(if autoRefreshList = ture)**
     * @type {Number}
     */
    this.refreshListInterval = 7.5;

    this.startPath = '/devices';

    this.$get = [function() {
        return {
            'refreshListInterval': this.refreshListInterval,
            'autoRefreshList': this.autoRefreshList,
            'startPath': this.startPath,
        };
    }];
}]);
