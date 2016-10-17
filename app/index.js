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

angular.module('voxityChromeApp').run(['vxtCoreApi', function(CoreApi){CoreApi.init();}])

angular.module('voxityChromeApp').config(['$httpProvider', function ($httpProvider) {$httpProvider.interceptors.push('authInterceptorService');}]);
angular.module('voxityChromeApp').config(['$uibTooltipProvider', function($uibTooltipProvider){$uibTooltipProvider.options({appendToBody: true});}])