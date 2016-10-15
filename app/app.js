
angular.module('voxityChromeApp', [
    'ngRoute',
    'ui.bootstrap',
    'ui.bootstrap.tpls',
])


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
            if(!err){
                $scope.phoneNumber = undefined;
            }
            console.log(err,status)
        })
    }
}])

angular.module('voxityChromeApp').controller('activeItemCtrl', [
    '$scope', '$location',
    function ($scope, $location, djangoAuth) {
        $scope.activeItem = null;

        function getMainEndpoint(uri){
            var hashTab = uri.split('#');
            if (hashTab.length == 2) {
                var main = hashTab[1];
                if (main[0] === '/'){
                    main = main.substring(1)
                }
                return main.split('/')[0]
            } else {
                return null
            }
        }
        $scope.change = function(item){$scope.activeItem = item;}

        $scope.$on('$locationChangeStart', function(e, next, curent){
            if (next.indexOf('#') > -1) {
                var nextAng = next.split('#')[1].split("/");                
                var curentAng = curent.split('#')[1].split("/");
                if (nextAng.length > 2) {
                    $scope.goBackPage = '#' + curentAng.join('/');
                } else {
                    $scope.goBackPage = undefined;
                }
            } else { $scope.goBackPage = undefined;}

            var main = getMainEndpoint(next);
            $scope.change(main);

        })

    }
]);

angular.module('voxityChromeApp').config( function ($compileProvider) {
   $compileProvider.aHrefSanitizationWhitelist (/^\s*(https?|ftp|mailto|file|tel|chrome-extension):/);
});