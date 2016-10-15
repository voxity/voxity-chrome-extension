angular.module('voxityChromeApp').controller('devicesListCtrl', [
    '$scope', 'api', 'apiDevices', 
    function ($scope, api, apiDevices) {
        $scope.loading = true;
        $scope.devices = [];
        $scope.errors = {err: false,mess:''};
        $scope.search = {};


        $scope.getClass = apiDevices.getIconClassStatus;
        $scope.getDescription = apiDevices.frDescription;

        $scope.init = function(){
            $scope.errors = {err: false,mess:''};
            $scope.loading = true;
            if (!api.token){
                return null;
            } else {
                apiDevices.get(function(err,devices){
                    if(err){
                        $scope.errors.err = true;
                        $scope.errors.mess = 'Une erreur est survenu lors du chargement des équipements. err' + err.status;
                    } else {
                        $scope.devices = devices;
                    }
                    $scope.loading = false;
               })
            }
        };$scope.init();


        $scope.$on('api:TOKEN_SET', $scope.init);
    }
])