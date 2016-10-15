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

angular.module('voxityChromeApp').factory('authInterceptorService', ['$q','$rootScope', function ($q, $rootScope){
    var responseError = function (rejection) {
        if (rejection.status === 401) {
            $rootScope.$broadcast("APP.auth.401");
        }
        return $q.reject(rejection);
    };

    return {
        responseError: responseError
    };
}]);

angular.module('voxityChromeApp').controller('bannerCallCtrl', ['$scope', 'apiChannels', function ($scope, apiChannels) {
    $scope.call = function(){
        apiChannels.post($scope.phoneNumber, function(err, channel){
            console.log(err,status)
        })
    }
}])
angular.module('voxityChromeApp').config(['$httpProvider', function ($httpProvider) {$httpProvider.interceptors.push('authInterceptorService');}]);