angular.module('voxity.sms').controller('vxtSmsCtrl', [
    '$scope', 'vxtCoreApi', 'vxtApiSms', 'vxtApiChannels', 'vxtApiContacts', '$rootScope', '$filter', '$location',
    function ($scope, api, apiSms, apiChannels, apiContacts, $rootScope, $filter, $location) {
        $scope.sms = [];
        $scope.loading = true;
        $scope.errors = {};
        $scope.contacts = [];

        $scope.switchToRecipient = function(num){
            $location.path('/sms/'+num);
        }

        $scope.findNumber = function(number){
            if(this.contacts.length === 0) return [];

            num = $filter('phoneNumber')(number, false);
            var res = $filter('filter')(this.contacts, num)
            if (res.length === 0){
                if (num.substring(0,1) === '+') {
                    res = $filter('filter')(this.contacts, num.substring(3))
                } else {
                    res = $filter('filter')(this.contacts, num.substring(1));
                }
                return res;
            } else {
                return res;
            } 
        }

        $scope.init = function(){
            $scope.sms = [];
            $scope.loading = true;
            $scope.errors = {};

            if (!api.token){
                return null;
            } else {
                apiSms.messages.get(function(err, sms){
                    if (err){
                        $scope.errors = {
                            'err': true,
                            'message': "Une erreur est survenu lors du chargement des SMS envoyés"
                        }
                    } else {
                        $scope.sms = sms;
                    }
                    $scope.loading = false;
                });
                apiContacts.get(function(err, contacts){
                    $scope.contacts = contacts;
                });

            }
        };$scope.init();

        $scope.$on('api:TOKEN_SET', $scope.init);
    }]
)