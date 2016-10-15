angular.module('voxityChromeApp').controller('contactsCtrl', [
    '$scope', 'api', 'apiContacts', 'apiChannels',
    function ($scope, api, apiContacts, apiChannels) {
        $scope.loading = true;
        $scope.contacts = [];
        $scope.errors = {err: false,mess:''};
        $scope.search = {};

        $scope.init = function(){
            $scope.errors = {err: false,mess:''};
            $scope.loading = true;
            if (!api.token){
                return null;
            } else {
                apiContacts.get(function(err,contacts){
                    if(err){
                        $scope.errors.err = true;
                        $scope.errors.mess = 'Une erreur est survenu lors du chargement des contacts. err' + err.status;
                    } else {
                        $scope.contacts = contacts;
                    }
                    $scope.loading = false;
               })
            }
        };$scope.init();

        $scope.call = function(phoneNumber){
            apiChannels.post(phoneNumber, function(err, data){

            })
        }


        $scope.$on('api:TOKEN_SET', $scope.init);
    }
])