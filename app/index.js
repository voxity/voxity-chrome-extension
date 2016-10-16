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
        rp.when('/contacts', {
            templateUrl: 'views/contacts/list.html',
            controller: 'contactsCtrl'
        })
        rp.when('/contacts/add', {
            templateUrl: 'views/contacts/form.html',
            controller: 'contactFormCtrl'
        })
        rp.when('/contact/:contactId/edit', {
            templateUrl: 'views/contacts/form.html',
            controller: 'contactFormCtrl'
        })
        rp.when('/contact/:contactId', {
            templateUrl: 'views/contacts/detail.html',
            controller: 'contactCtrl'
        })
        rp.when('/settings/',{
            templateUrl: 'views/settings/index.html',
            controller: 'settingsCtrl'
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