angular.module('voxity.channels').controller('makeCallCtrl', [
    '$scope', 'vxtCoreApi', 'vxtApiChannels',
    function ($scope, api, apiChannels) {
        $scope.callProcessing = false;

        $scope.call = function(){
            this.callProcessing = true;
            apiChannels.post(this.phoneNumber, function(err, channel){
                if(!err){
                    $scope.phoneNumber = undefined;
                }else {console.log(err,status)}
                $scope.callProcessing = false;
            })
        }
        $scope.checkNumber = function(){
            this.phoneNumber = $scope.phoneNumber.replace(/[^\+\d\(\)]/g,'');
        }
    }
]);