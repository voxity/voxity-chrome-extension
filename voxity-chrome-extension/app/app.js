angular.module('voxityChromeApp', [
    'ngRoute',
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'voxity.core',
    'voxity.users',
    'voxity.channels',
    'voxity.devices',
    'voxity.contacts',
])

angular.module('voxityChromeApp').factory('authInterceptorService', [
    '$q','$rootScope',
    function ($q, $rootScope){
        return {
            responseError: function (rejection) {
                if (rejection.status === 401) {$rootScope.$broadcast("API:err.401");}
                return $q.reject(rejection);
            }
        };
    }
]);

angular.module('voxityChromeApp').controller('activeItemCtrl', [
    '$scope', '$location',
    function ($scope, $location) {
        $scope.activeItem = null;

        function getMainEndpoint(uri){
            var hashTab = uri.split('#');
            if (hashTab.length == 2) {
                var main = hashTab[1];
                if (main[0] === '/'){
                    main = main.substring(1);
                }
                return main.split('/')[0];
            } else {
                return null;
            }
        }

        $scope.change = function(item){$scope.activeItem = item;}

        $scope.open = function(link){
            chrome.tabs.create({url: link});
            window.close();
        }

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

angular.module('voxityChromeApp').config(['$compileProvider', function($compileProvider) {
   $compileProvider.aHrefSanitizationWhitelist (/^\s*(https?|ftp|mailto|file|tel|chrome-extension):/);
}]);