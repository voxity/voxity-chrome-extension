angular.module('voxityChromeApp').config(['$routeProvider',
    function(rp) {
        rp.when('/', {redirectTo: '/devices/'});
        rp.when('/settings/',{
            templateUrl: 'views/settings/index.html',
            controller: 'coreSettingsCtrl'
        })
        rp.otherwise({templateUrl: 'views/err/404.html'});
    }
]);


angular.module('voxity.devices').config(['vxtDeviceConfProvider',function(DeviceConf) {
    chrome.storage.sync.get({'wAppConf': null}, function(item){
        var conf = item.wAppConf;

        if(angular.isObject(conf.device) && Object.keys(conf.device).length > 0){
            DeviceConf.refreshListInterval = conf.device.refreshListInterval;
            DeviceConf.autoRefreshList = conf.device.autoRefreshList;
            DeviceConf.checkValue()
        } else {DeviceConf.initDefault();}
    });
}]);

angular.module('voxityChromeApp').run([
    'vxtCoreApi', 'settingsService',
    function(CoreApi, settingsService){
        CoreApi.init();
    }
])

angular.module('voxityChromeApp').config(['$httpProvider', function ($httpProvider) {$httpProvider.interceptors.push('authInterceptorService');}]);
angular.module('voxityChromeApp').config(['$uibTooltipProvider', function($uibTooltipProvider){$uibTooltipProvider.options({appendToBody: true});}])