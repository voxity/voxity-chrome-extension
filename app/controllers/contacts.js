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

        $scope.checkSortCut = function(shortcut){
            if(angular.isString(shortcut) && shortcut.trim().length > 0){
                shortcut = shortcut.trim();
                if(shortcut[0] !== '*') {
                    return '*' + shortcut;
                } else {
                    return shortcut
                }
            } else {
                return undefined;
            }
        }

        $scope.call = function(phoneNumber){
            apiChannels.post(phoneNumber, function(err, data){

            })
        }


        $scope.$on('api:TOKEN_SET', $scope.init);
    }
])

angular.module('voxityChromeApp').controller('contactCtrl', [
    '$scope', 'api', 'apiContacts', 'apiChannels', '$routeParams',
    function ($scope, api, apiContacts, apiChannels, $routeParams) {
        $scope.loading = true;
        $scope.contact = null;
        $scope.errors = {err: false,mess:''};
        $scope.search = {};

        $scope.init = function(){
            $scope.errors = {err: false,mess:''};
            $scope.loading = true;
            if (!api.token){
                return null;
            } else {
                apiContacts.getId($routeParams.contactId, function(err, contact){
                    if(err){
                        if (err.status === 404) {
                            $scope.errors.err = true;
                            $scope.errors.notFound = true;
                        } else {
                            $scope.errors.err = true;
                            $scope.errors.mess = 'Une erreur est survenu lors du chargement du contact. err' + err.status;
                        }
                    } else {
                        $scope.contact = contact;
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