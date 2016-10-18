angular.module('voxity.core').controller('coreSettingsCtrl', [
    '$scope', 'vxtCoreApi', 'settingsService', 'vxtApiUsers', '$window',
    function ($scope, api, settingsService, apiUsers, $window) {
        $scope.isInit = -1;
        $scope.user = {};
        $scope.device = null;
        $scope.updated = false;

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
                    $scope.device = conf.device;
                    $scope.isInit += 1;
                })
                apiUsers.getUser(function(err, usr){
                    $scope.user = usr;
                    $scope.isInit += 1;
                })
            }
        };$scope.init();

        $scope.save = function(){
            settingsService.set($scope.device, 'device')
            $scope.updated = true;
        }

        $scope.$on('api:user.updated', function(evt, usr){
            $scope.user = usr;
        });
        
    }
])
