angular.module('voxity.sms').controller('vxtSmsCtrl', [
    '$scope', 'vxtCoreApi', 'vxtApiSms', 'vxtApiContacts', 'vxtApiChannels', '$rootScope', '$filter', '$location',
    function ($scope, api, apiSms, apiContacts, apiChannels, $rootScope, $filter, $location) {
        $scope.sms = [];
        $scope.loading = true;
        $scope.errors = {};
        $scope.contacts = [];

        $scope.switchToRecipient = function(num){
            $location.path('/sms/chat/'+num);
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

        $scope.call = function(){
            this.callProcessing = true;
            apiChannels.post(this.phoneNumber, function(err, channel){
                if(!err){
                    $scope.phoneNumber = undefined;
                }else {console.log(err,status)}
                $scope.callProcessing = false;
            })
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
);

angular.module('voxity.sms').controller('vxtSmsChatCtrl', [
    '$scope', 'vxtCoreApi', 'vxtApiSms', 'vxtApiChannels', 'vxtApiContacts', '$rootScope', '$filter', '$location', '$routeParams',
    function ($scope, api, apiSms, apiChannels, apiContacts, $rootScope, $filter, $location, $routeParams) {
        $scope.sms = [];
        $scope.loading = true;
        $scope.errors = {};
        $scope.recipientNames = [];
        $scope.loadingResp = true;
        $scope.responses = [];

        $scope.call = function(num){
            apiChannels.post(num, function(err, data){

            });
        }

        $scope.getResponse = function(messageId){
            if (this.responses.length > 0) {
                return $filter('groupBy')(this.responses, 'id_sms_sent')[messageId] || [];
            } else {
                return [];
            }
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
            $scope.loadingResp = true;
            $scope.errors = {};

            if (!api.token){
                return null;
            } else {
                $scope.num = $routeParams.smsPhoneNumber;
                apiSms.messages.get(function(err, sms){
                    if (err){
                        $scope.errors = {
                            'err': true,
                            'message': "Une erreur est survenu lors du chargement des SMS envoyés"
                        }
                    } else {
                        sms = $filter('groupBy')(sms, 'phone_number');
                        if (sms[$scope.num]) {
                            $scope.sms = sms[$scope.num];
                            apiSms.responses.get(function(err, responses){
                                responses = $filter('groupBy')(responses, 'phone_number');
                                if (responses[$scope.num]) {
                                    $scope.responses = responses[$scope.num];
                                }
                                $scope.loadingResp = false;

                            })
                        } else {
                            $scope.errors = {
                                'err': true,
                                'message': "Aucun SMS trouver à déstination de "+ $routeParams.smsPhoneNumber
                            }
                        }
                    }
                    $scope.loading = false;
                });
                apiContacts.get(function(err, contacts){
                    $scope.contacts = contacts || [];
                    $scope.recipientNames = $scope.findNumber($scope.num);
                });
            }
        };$scope.init();

        $scope.$on('api:TOKEN_SET', $scope.init);
    }]
);


angular.module('voxity.sms').controller('vxtSmsFormCtrl', [
    '$scope', 'vxtCoreApi', 'vxtApiSms', 'vxtApiContacts', '$rootScope', '$filter', '$location', '$routeParams',
    function ($scope, api, apiSms, apiContacts, $rootScope, $filter, $location, $routeParams) {
        $scope.sms = {};
        $scope.emitter = false;
        $scope.loadingContact = true;
        $scope.contacts = [];
        $scope.contacstList = false;

        $scope.findNumber = function(number){
            if($scope.contacts.length === 0) return [];

            num = $filter('phoneNumber')(number, false);
            var res = $filter('filter')($scope.contacts, num)
            if (res.length === 0){
                if (num.substring(0,1) === '+') {
                    res = $filter('filter')($scope.contacts, num.substring(3))
                } else if (num.substring(0,2) == '33'){
                    res = $filter('filter')($scope.contacts, '0'+num.substring(2));
                } else {
                    res = $filter('filter')($scope.contacts, num.substring(1));
                }
                return res;
            } else {
                return res;
            } 
        }


        $scope.emitterDataChange = function(){
            this.sms.emitter = null;
            this.emitter = !this.emitter 
        }

        $scope.getPlaceholderDest = function(){
            if (this.emitter) {
                return "ex : SocieteName"
            } else {return null;}
        }
        function loadContacts(){
            if (api.token){
                $scope.contacts = [];
                apiContacts.get(function(err, contacts){
                    $scope.contacts = contacts || [];
                    $scope.loadingContact = false;
                })
            }
        }
        $scope.addNumber = function(num){
            if (num && num.trim().length > 0) {
                $scope.sms.phone_number = num;
                $scope.contacstList = false;
            }
        }
        $scope.isRecipients = function(num){
            return num === $scope.sms.phone_number;
        }
        $scope.init = function(){
            $scope.sms = {};
            $scope.emitter = false;

            if ($location.search()['phone_number']) {
                $scope.sms.phone_number = $location.search()['phone_number'].trim();
            };
            loadContacts()
        };$scope.init();

        $scope.send = function(){
            apiSms.messages.post($scope.sms, function(err, sms){
                if (err) {
                    $scope.errors = {'message': "Une erreur est survenu, verifier votre formulaire. err"+err.status}
                } else {
                    $location.path('/sms/'+sms.phone_number)
                }
            })
        }

        $scope.$on('api:TOKEN_SET', loadContacts);
    }]
);
