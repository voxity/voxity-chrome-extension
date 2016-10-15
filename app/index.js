angular.module('voxityChromeApp').config(['$routeProvider',
    function(rp) {
        rp.when('/', {redirectTo: '/devices/'});
        rp.when('/devices/:phoneId', {
            templateUrl: 'views/devices/detail.html',
            controller: 'deviceCtrl'
        });
        rp.when('/devices', {
            templateUrl: 'views/devices/list.html',
            controller: 'devicesListCtrl'
        })
        
        rp.otherwise({templateUrl: 'views/err/404.html'});
    }
]);

angular.module('voxityChromeApp').run(['api', function(api){
    api.init();
}])

angular.module('voxityChromeApp').config(['$httpProvider', function ($httpProvider) {$httpProvider.interceptors.push('authInterceptorService');}]);
angular.module('voxityChromeApp').config(['$uibTooltipProvider', function($uibTooltipProvider){
    $uibTooltipProvider.options({appendToBody: true});
}])