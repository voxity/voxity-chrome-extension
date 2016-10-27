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

    this.getConf = function(){
        return {
            'refreshListInterval': this.refreshListInterval,
            'autoRefreshList': this.autoRefreshList
        }
    }
    this.checkValue = function(){
        var updatedValue = []
        if (typeof this.autoRefreshList !== 'boolean') {
            updatedValue.push('autoRefreshList');
            this.initDefault('autoRefreshList')
        }

        if (!angular.isNumber(this.refreshListInterval) ||  this.refreshListInterval <= 5 ) {
            updatedValue.push('refreshListInterval');
            this.initDefault('refreshListInterval');
        }

        if (updatedValue.length > 0) {
            angular.forEach(updatedValue, function(i, attr){
                contactConf.initDefault(i)
            }, function(){
                settingsService.set(contactConf.getConf(), 'device')
            })
        }
    }

    this.initDefault = function(attribut){
        console.log('default value')
        if (!attribut || attribut === 'autoRefreshList') {
            this.autoRefreshList = false;
        }
        if (!attribut || attribut === 'refreshListInterval') {
            this.refreshListInterval = 7.5;
        }
        settingsService.set(this.getConf(), 'device')
    }

    this.startPath = '/devices';

    this.$get = [function() {
        return {
            'refreshListInterval': this.refreshListInterval,
            'autoRefreshList': this.autoRefreshList,
            'startPath': this.startPath,
        };
    }];
}]);
