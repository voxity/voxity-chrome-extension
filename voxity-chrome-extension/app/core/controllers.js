angular.module('voxity.core').controller('coreSettingsCtrl', [
    '$scope', 'vxtCoreApi', 'settingsService', 'vxtApiUsers', '$window', 'vxtApiSms',
    function ($scope, api, settingsService, apiUsers, $window, apiSms) {
        $scope.isInit = -1;
        $scope.user = {};
        $scope.contact = {};
        $scope.device = {};
        $scope.updated = false;
        $scope.conf = {
            'device': {},
            'contact': {},
            'sms': {},
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
                    $scope.conf = conf;
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
        
        $scope.sms = {
            'getPlaceholderDest': function(){
                if ($scope.sms.emitter) {
                    return "ex : SocieteName"
                } else {return null;}
            },
            'cleanEmitter': function(){
                $scope.conf.sms.defaultEmitterValue = apiSms.clean.emitter($scope.conf.sms.defaultEmitterValue);
            },
            'emitterDataChange': function(){
                $scope.conf.sms.defaultEmitter = !$scope.conf.sms.defaultEmitter;
                $scope.conf.sms.defaultEmitterValue = null;
            },
            'valideEmitter': function(){
                if ($scope.conf.sms.defaultEmitter) {
                    if ($scope.conf.sms.defaultEmitterValue) return $scope.conf.sms.defaultEmitterValue.match(/^[a-zA-Z]{4,11}$/);
                    return false;
                } else {
                    return true;
                }
            }
        }
    }
]);

angular.module('voxity.core').controller('viewCtrl', ['$scope', '$location', function($scope, $location){
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

    if ($location.search()['sigleViewPage']) siglePage();

    $scope.sideClass = function(){return sideClass};
    $scope.mainBodyClass = function(){return mainBodyClass};
    $scope.bannerCallClass = function(){return bannerCallClass}
    $scope.containerClass = function(){return containerClass}

    $scope.$on('CORE:view.hide-sidebare', hideSidebar);
    $scope.$on('CORE:view.siglePage', siglePage);
}]);

