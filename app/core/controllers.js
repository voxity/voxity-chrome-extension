angular.module('voxity.core').controller('coreSettingsCtrl', [
    '$scope', 'vxtCoreApi', 'vxtApiUsers',
    function ($scope, api, apiUsers) {
        $scope.user = {};

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
                apiUsers.getUser(function(err, usr){
                    $scope.user = usr;
                })
            }
        };$scope.init();

        $scope.$on('api:user.updated', function(evt, usr){
            $scope.user = usr;
        });
        
    }
])
