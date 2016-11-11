angular.module('voxity.core').controller('coreSettingsCtrl', [
    '$scope', 'vxtCoreApi', 'vxtApiUsers', '$window',
    function ($scope, api, apiUsers, $window) {
        $scope.isInit = -1;
        $scope.user = {};
        $scope.contact = {};
        $scope.device = {};
        $scope.updated = false;
        $scope.conf = {
            'device': {},
            'contact': {},
        };

        $scope.collapse = {
            'telephone': false,
            'contacts': false,
        }

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
            
        };$scope.init();

        $scope.save = function(){
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
