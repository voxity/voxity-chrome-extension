angular.module('voxityChromeApp').filter('phoneNumber',function(){
    return function(phoneInpt){
        var cleanPhone = phoneInpt;
        if(angular.isString(phoneInpt)){
            cleanPhone = phoneInpt.trim().replace(/(\s|\-|\.|_\,)/g, '');
            if(cleanPhone.match(/^0[1-79]\d{8}$/)){
                return cleanPhone.replace(/(.{2})/g,"$1 ")
            } else if(cleanPhone.match(/^\+\d{2}\d{8}$/)){
                var plus = cleanPhone.substring(0,3);
                var code = cleanPhone.substring(3,4);
                var endNum = cleanPhone.substring(4,12).replace(/(.{2})/g,"$1 ")
                return (plus + code + endNum).trim();
            }
        }
        return cleanPhone;
    }
});
/*

cleanPhone = '+33(0)481680110'
cleanPhone.match(/^\+\d{2}\(\d\)\d{8}$/)
cleanPhone.substring(0,3) + cleanPhone.substring(6, 7) + ' ' + cleanPhone.substring(7).replace(/(.{2})/g,"$1 ")

 */
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
            if(phoneNumber){
                apiChannels.post(phoneNumber, function(err, data){

                })
            }
        }


        $scope.$on('api:TOKEN_SET', $scope.init);
    }
])