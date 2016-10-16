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

angular.module('voxityChromeApp').controller('contactFormCtrl', [
    '$scope', 'api', 'apiContacts', '$routeParams', '$location', '$interval',
    function ($scope, api, apiContacts, $routeParams, $location, $interval) {
        $scope.loading = true;
        $scope.contact = null;
        $scope.errors = {err: false,mess:''};

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

        $scope.save = function(){
            this.processing = true;
            this.id ? this.update() : this.create();
        }

        $scope.update = function(){
            this.processing = true;
            apiContacts.update(this.contact, function(err, result){
                if (!err) {
                    $scope.changeSave = true;
                    $interval(function(){$scope.changeSave = false}, 5000, 1)
                } else {
                    $scope.errors.err = true;
                    $scope.errors.mess = 'Une erreur est survenue lors de la mise à jour du contact. err' + err.status;
                }
                $scope.processing = false;
            })
        }

        $scope.create = function(){
            this.processing = true;
            apiContacts.create(this.contact, function(err, uid){
                if(!err){
                    $location.path('/contact/'+uid)
                } else {
                    $scope.errors.err = true;
                    $scope.errors.mess = 'Une erreur est survenue lors de la création du contact. err' + err.status;
                }
                $scope.processing = false;
            })
        }

        $scope.delete = function(){
            if(this.id){
                this.processing = true;
                apiContacts.delete(this.id, function(err, uid){
                    if(!err){
                        $location.path('/contacts/')
                    } else {
                        $scope.errors.err = true;
                        $scope.errors.mess = 'Une erreur est survenue lors de ma suppresion du contact. err' + err.status;
                    }
                    this.processing = false;
                })
            }

        }

        $scope.init = function(){
            $scope.errors = {err: false,mess:''};
            $scope.loading = true;
            if (!api.token){
                return null;
            } else {
                if($routeParams.contactId){
                    $scope.id = $routeParams.contactId;
                    $scope.name = null;
                    apiContacts.getId($routeParams.contactId, function(err, contact){
                        if(err){
                            if (err.status === 404) {
                                $scope.errors.err = true;
                                $scope.errors.notFound = true;
                            } else {
                                $scope.errors.err = true;
                                $scope.errors.mess = 'Une erreur est survenue lors du chargement du contact. err' + err.status;
                            }
                        } else {
                            $scope.name = contact.cn;
                            $scope.contact = contact;
                        }
                        $scope.loading = false;
                   })
                } else {$scope.id = null;}
            }
        };$scope.init();

        $scope.call = function(phoneNumber){
            if(phoneNumber){
                apiChannels.post(phoneNumber, function(err, data){

                })
            }
        }

        $scope.getSubmitClass = function(){
            if(this.processing){
                return 'fa fa-spin fa-circle-o-notch';
            } else if(this.id){
                return 'fa fa-check';
            } else {
                return 'fa fa-plus';
            }
        }


        $scope.$on('api:TOKEN_SET', $scope.init);
    }
])