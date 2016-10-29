angular.module('voxity.core').controller('coreSettingsCtrl', [
    '$scope', 'vxtCoreApi', 'settingsService', 'vxtApiUsers', '$window',
    function ($scope, api, settingsService, apiUsers, $window) {
        $scope.isInit = -1;
        $scope.user = {};
        $scope.contact = {};
        $scope.device = {};
        $scope.updated = false;
        $scope.conf = {
            'device': {},
            'contact': {}
        };

        $scope.getConf = function(){
            return $scope.conf;
        }

        $scope.getUser = function(){
            return this.user;
        }

        $scope.logout = function(){
            this.logOutProcess = true
            apiUsers.logout(function(err){
                if(!err) {
                    window.close();
                } else {this.logOutProcess = false;}
            })
        }

        $scope.init = function(){
            if(api.token){
                settingsService.get(function(err, conf){
                    $scope.conf = {}
                    $scope.conf.device = conf.device;
                    $scope.conf.contact = conf.contact;
                    $scope.isInit += 1;
                })
                apiUsers.getUser(function(err, usr){
                    $scope.user = usr;
                    $scope.isInit += 1;
                })
            }
        };$scope.init();

        $scope.save = function(){
            settingsService.set($scope.conf)
            $scope.updated = true;
        }

        $scope.$on('api:user.updated', function(evt, usr){
            $scope.user = usr;
        });
        $scope.$on('api:TOKEN_SET', $scope.init);


        $scope.checkDeviceInterval = function(){
            if ($scope.device.refreshListInterval < 5) {
                $scope.device.refreshListInterval = 5;
            }
        }
        
    }
]);

angular.module('voxity.core').controller('viewCtrl', ['$scope', function($scope){
    var sideClass = "col-xs-2";
    var mainBodyClass = "col-xs-10 col-xs-offset-2";
    var bannerCallClass = "";
    var containerClass = "";

    function hideSidebar(){
        sideClass = "hidden";
        mainBodyClass = "col-xs-12";
    }

    function siglePage(){
        hideSidebar();
        containerClass = "siglePage"
        bannerCallClass = 'hidden';
    }



    $scope.sideClass = function(){return sideClass};
    $scope.mainBodyClass = function(){return mainBodyClass};
    $scope.bannerCallClass = function(){return bannerCallClass}
    $scope.containerClass = function(){return containerClass}

    $scope.$on('CORE:view.hide-sidebare', hideSidebar);
    $scope.$on('CORE:view.siglePage', siglePage);
}]);

