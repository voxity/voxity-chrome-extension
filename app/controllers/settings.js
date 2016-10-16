angular.module('voxityChromeApp').controller('settingsCtrl', [
    '$scope', 'api', 'apiUsers',
    function ($scope, api, apiUsers) {
        $scope.user = {};


        $scope.init = function(){
            if(api.token){
                apiUsers.getUser(function(err, usr){
                    console.log(usr);
                    $scope.user = usr;
                })
            }
        };$scope.init();

        $scope.$on('api:user.updated', function(evt, usr){
            $scope.user = usr;
        });
        
    }
])
