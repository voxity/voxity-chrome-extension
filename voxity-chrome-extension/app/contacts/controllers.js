
angular.module('voxity.contacts').controller('vxtContactsCtrl', [
    '$scope', 'vxtCoreApi', 'vxtApiContacts', 'vxtApiChannels', 'vxtApiUsers', '$location', '$rootScope',
    function ($scope, api, apiContacts, apiChannels, apiUsers, $location, $rootScope) {
        $scope.loading = true;
        $scope.contacts = [];
        $scope.errors = {err: false,mess:''};
        $scope.search = {};

        $scope.init = function(){
            $scope.errors = {err: false,mess:''};
            $scope.loading = true;
            if ($location.search()['search']) {
                $rootScope.$broadcast('CORE:view.siglePage', {});
                $scope.search.all = $location.search()['search'];
            }
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
                apiUsers.getUser(function(err, usr){
                    $scope.user = usr;
                })
            }

        };$scope.init();

        $scope.mailTo = function(mail){
            var windowMail = chrome.windows.create({
                url: "mailto:"+ mail,
                type: 'popup',
                focused: false,
                width: 1,
                height: 1,
            }, function(windowMail){
                setTimeout(function() {
                    chrome.windows.remove(windowMail.id);
                }, 110);
            })
        }

        $scope.call = function(phoneNumber){
            apiChannels.post(phoneNumber, function(err, data){
                
            })
        }

        $scope.switchTo = function(uid){
            $location.path('/contact/'+uid)
        }

        $scope.$on('api:TOKEN_SET', $scope.init);
    }
])

angular.module('voxity.contacts').controller('vxtContactCtrl', [
    '$scope', '$routeParams', 'vxtCoreApi', 'vxtApiContacts', 'vxtApiChannels', 'vxtApiUsers',
    function ($scope, $routeParams, api, apiContacts, apiChannels, apiUsers) {
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
                apiUsers.getUser(function(err, usr){$scope.user = usr;})
            }
        };$scope.init();

        $scope.call = function(phoneNumber){
            if(phoneNumber){
                apiChannels.post(phoneNumber, function(err, data){

                })
            }
        };

        $scope.mailTo = function(mail){
            var windowMail = chrome.windows.create({
                url: "mailto:"+ mail,
                type: 'popup',
                focused: false,
                width: 1,
                height: 1,
            }, function(windowMail){
                setTimeout(function() {
                    chrome.windows.remove(windowMail.id);
                }, 110);
            })
        }
        $scope.$on('api:TOKEN_SET', $scope.init);
    }
])

angular.module('voxity.contacts').controller('vxtContactFormCtrl', [
    '$scope', '$routeParams', '$location', '$interval', 'vxtCoreApi', 'vxtApiContacts', 'vxtApiUsers', '$rootScope',
    function ($scope, $routeParams, $location, $interval, api, apiContacts, apiUsers, $rootScope) {
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
                    if (err.status == 400) {
                        $scope.errors.mess = 'Une erreur est présent dans le formulaire';

                    } else {
                        $scope.errors.mess = 'Une erreur est survenue lors de la mise à jour du contact. err' + err.status;
                    }
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
                    if (err.status == 400) {
                        $scope.errors.mess = 'Une erreur est présent dans le formulaire';

                    } else {
                        $scope.errors.mess = 'Une erreur est survenue lors de la mise à jour du contact. err' + err.status;
                    }
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

        $scope.getSubmitClass = function(){
            if(this.processing){
                return 'fa fa-spin fa-circle-o-notch';
            } else if(this.id){
                return 'fa fa-check';
            } else {
                return 'fa fa-plus';
            }
        }

        $scope.validate = function(){
            if (!$scope.errors) $scope.errors = {};
            $scope.errors.form = apiContacts.validate($scope.contact);
        }

        $scope.init = function(){
            $scope.errors = {err: false,mess:''};
            $scope.loading = true;
            if ($location.search()['phone_number']) {
                $rootScope.$broadcast('CORE:view.siglePage', {})
            }
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
                            $scope.validate();
                        }
                        $scope.loading = false;
                   })
                } else {
                    $scope.id = null;
                    if (!$scope.contact) {
                        $scope.contact = {};
                    }
                    $scope.validate();
                    if ($location.search()['phone_number']) {
                        var value = $location.search()['phone_number'].trim();
                        if (value.replace(/(\d|[+\\\/\-\ \(\)])*/g, '').trim() != '') {
                            $scope.contact.cn = value;
                        } else {
                            $scope.contact.telephoneNumber = value.replace(/[+\\\/\-\ \(\)]*/g, '');
                        }
                    }
                    $scope.errors.form.firstInit = true
                }
                apiUsers.getUser(function(err, usr){
                    $scope.user = usr;
                    if(!usr.is_admin){
                        $location.path('/err/403');
                    }
                })
            }
        };$scope.init();

        $scope.$watch('contact.cn', function(n,h){if (n != h) $scope.validate()})
        $scope.$watch('contact.telephoneNu', function(n,h){if (n != h) $scope.validate()})
        $scope.$on('api:TOKEN_SET', $scope.init);
    }
])