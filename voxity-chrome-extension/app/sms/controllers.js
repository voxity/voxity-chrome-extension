angular.module('voxity.sms').controller('vxtSmsCtrl', [
    '$scope', 'vxtCoreApi', 'vxtApiSms', 'vxtApiContacts', 'vxtApiChannels', '$rootScope', '$filter', '$location',
    function ($scope, api, apiSms, apiContacts, apiChannels, $rootScope, $filter, $location) {
        $scope.sms = [];
        $scope.loading = true;
        $scope.errors = {};
        $scope.contacts = [];
        $scope.search = {};

        $scope.switchToRecipient = function(num){
            $location.path('/sms/chat/'+num);
        }

        $scope.findNumber = apiContacts.findNumber;

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

        $scope.findNumber = apiContacts.findNumber;

        $scope.init = function(force){
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

                            }, force)
                        } else {
                            $scope.errors = {
                                'err': true,
                                'message': "Aucun SMS trouver à déstination de "+ $routeParams.smsPhoneNumber
                            }
                        }
                    }
                    $scope.loading = false;
                }, force);
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
    '$scope', 'vxtCoreApi', 'vxtApiSms', 'vxtApiContacts', '$rootScope', '$filter', '$location', '$routeParams', 'vxtSmsConf',
    function ($scope, api, apiSms, apiContacts, $rootScope, $filter, $location, $routeParams, smsConf) {
        $scope.sms = {};
        $scope.emitter = false;
        $scope.loadingContact = true;
        $scope.contacts = [];
        $scope.contacstList = false;

        $scope.findNumber = apiContacts.findNumber;

        $scope.validePhoneNumber = function(){
            if (angular.isString($scope.sms.phone_number) && $scope.sms.phone_number.length > 0) {
                return $scope.sms.phone_number.match(/^\d{10}$/);
            } else {
                return true
            }
        }

        $scope.valideEmitter = function(){
            if ($scope.emitter) {
                if ($scope.sms.emitter) return $scope.sms.emitter.match(/^[a-zA-Z]{4,11}$/);
                return false;
            } else {
                return true;
            }
        }

        $scope.cleanPhoneNumber = function(){
            $scope.sms.phone_number = apiSms.clean.phoneNumber($scope.sms.phone_number);
        }
        $scope.cleanEmitter = function(){
            $scope.sms.emitter = apiSms.clean.emitter($scope.sms.emitter);
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
                $scope.cleanPhoneNumber();
                $scope.contacstList = false;
            }
        }
        $scope.isRecipients = function(num){
            return num === $scope.sms.phone_number;
        }

        $scope.init = function(){
            $scope.sms = {};
            $scope.sms.emitter = smsConf.defaultEmitterValue;
            $scope.emitter = smsConf.defaultEmitter;

            if ($location.search()['phone_number']) {
                $scope.sms.phone_number = $location.search()['phone_number'].trim();
                $scope.cleanPhoneNumber();
            };
            loadContacts()
        };$scope.init();

        $scope.send = function(){
            apiSms.messages.post($scope.sms, function(err, sms){
                if (err) {
                    $scope.errors = {'message': "Une erreur est survenu, verifier votre formulaire. err"+err.status}
                } else {
                    $location.path('/sms/chat/'+sms.phone_number)
                }
            })
        }

        $scope.isValidForm = function(){
            return this.valideEmitter() && $scope.validePhoneNumber() && $scope.sms.content && $scope.sms.content.length > 0;
        }

        $scope.$on('api:TOKEN_SET', loadContacts);
    }]
);
