angular.module('voxityChromeApp', [
    'ngRoute',
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'angular.filter',
    'voxity.core',
    'voxity.users',
    'voxity.channels',
    'voxity.devices',
    'voxity.contacts',
]);

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

angular.module('voxityChromeApp').controller('sideBarCtrl', [
    '$scope', '$location', 'vxtApiUsers',
    function ($scope, $location, apiUsers) {
        $scope.activeItem = null;
        $scope.logOutProcess = false;
        $scope.user = {};
        $scope.initialized = false;


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

        $scope.logout = function(){
            this.logOutProcess = true;
            apiUsers.logout(function(err){
                if(err) {
                    this.logOutProcess = false;
                } else {
                    $location.path('/logout');
                }
            })
        }

        $scope.$on('api:user.updated', function(evt, usr){$scope.user = usr;});
        $scope.$on('api:users.userInitialised', function(){$scope.initialized = true;});

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

angular.module('voxityChromeApp').controller('viewCtrl', [
    '$scope', '$location', 'vxtApiUsers',
    function($scope, $location, apiUsers){
    var sideClass = "hidden";
    var mainBodyClass = "col-xs-10 col-xs-offset-2";
    var bannerCallClass = "";
    var containerClass = "";
    var lockedScreen = false;

    $scope.signin = function(){
        apiUsers.init(function(err,usr){
            if (!err && user) {
                openDashboard('login', usr);
            }
        });
    }

    function hideSidebar(){
        sideClass = "hidden";
        mainBodyClass = "col-xs-12";
    }
    function showSideBar(){
        sideClass = "col-xs-2";
        mainBodyClass = "col-xs-10 col-xs-offset-2";

    }

    function siglePage(){
        hideSidebar();
        containerClass = "siglePage"
        bannerCallClass = 'hidden';
    }
    function openDashboard(evt, usr){
        showSideBar();
        $scope.initialized = true;
        $location.path('/devices');

    }


    if ($location.search()['sigleViewPage']) siglePage();

    $scope.sideClass = function(){return sideClass};
    $scope.mainBodyClass = function(){return mainBodyClass};
    $scope.bannerCallClass = function(){return bannerCallClass}
    $scope.containerClass = function(){return containerClass}

    $scope.$on('CORE:view.hide-sidebare', hideSidebar);
    $scope.$on('CORE:view.siglePage', siglePage);
    $scope.$on('api:user.logout', siglePage);
    $scope.$on('api:users.userInitialised', openDashboard);
    $scope.$on('api:TOKEN_SET', function(){apiUsers.init(function(){})});
    $scope.$on('api:TOKEN_ERROR', function(){apiUsers.init()});

}]);

angular.module('voxityChromeApp').config(['$compileProvider', function($compileProvider) {
   $compileProvider.aHrefSanitizationWhitelist (/^\s*(https?|ftp|mailto|file|tel|chrome-extension):/);
}]);