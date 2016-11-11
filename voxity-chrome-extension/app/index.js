angular.module('voxityChromeApp').config(['$routeProvider',
    function(rp) {
        rp.when('', {templateUrl: "views/loading.html"});
        rp.when('/', {templateUrl: "views/loading.html", controller:"sideBarCtrl"});
        rp.when('/logout', {templateUrl: "views/logout.html"});
        rp.when('/about/',{
            templateUrl: 'views/core/about.html'
        })
        rp.otherwise({templateUrl: 'views/err/404.html'});
    }
]);


angular.module('voxity.devices').config(['vxtDeviceConfProvider',function(deviceConf) {
}]);

angular.module('voxity.contacts').config(['vxtContactsConfProvider',function(contact) {
}]);

angular.module('voxityChromeApp').run([
    'vxtCoreApi',
    function(CoreApi){
        CoreApi.init();
    }
]);

angular.module('voxityChromeApp').config(['$httpProvider', function ($httpProvider) {$httpProvider.interceptors.push('authInterceptorService');}]);
angular.module('voxityChromeApp').config(['$uibTooltipProvider', function($uibTooltipProvider){$uibTooltipProvider.options({appendToBody: true});}]);