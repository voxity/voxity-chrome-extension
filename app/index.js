angular.module('voxityChromeApp').config(['$routeProvider',
    function(rp) {
        rp.when('/devices/', {
            templateUrl: 'views/devices/list.html',
            controller: 'devicesListCtrl'
        })
        rp.otherwise({
            redirectTo: '/devices/'
        });
    }
]);

angular.module('voxityChromeApp').run(['api', function(api){
    api.init();
}])

angular.module('voxityChromeApp').config(['$httpProvider', function ($httpProvider) {$httpProvider.interceptors.push('authInterceptorService');}]);