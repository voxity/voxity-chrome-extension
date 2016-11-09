angular.module('voxity.users').service('vxtApiUsers', [
    'vxtCoreApi', '$rootScope', 'settingsService',
    function(api, $rootScope, settings){
        var EXPIRED_USER_TIME = 2 * 60 * 60 * 1000 
        var users = {};
        users.user = null;

        function expiredUser(){
            return new Date() - users.user > EXPIRED_USER_TIME
        }

        function setUser(user){
            if(angular.isObject(user)){
                users.user = user;
                $rootScope.$broadcast('api:user.updated', user)
            }

        }

        users.getUser = function(done){
            if(!angular.isFunction(done)){
                done = function(){}
            }

            if (this.user && this.user.id && !expiredUser()){
                return done(null, this.user)
            } else {
                chrome.runtime.getBackgroundPage(function(bkg){
                    chrome.storage.sync.get({'user': null}, function(item){
                        if (item.user) {
                            setUser(item.user);
                            if (expiredUser()) {
                                init(done)
                            } else {
                                done(null, users.user)
                            }
                        } else {
                            users.init(done)
                        }
                    }); 

                })
            }
        }

        users.init = function(done){
            api.request({
                url: '/users/self',
            }).success(function(d){
                var user = d.result
                user.last_syc = new Date();
                setUser(user)
                chrome.storage.sync.set({'user': user});
                console.log('emited api:users.userInitialised')
                $rootScope.$broadcast('api:users.userInitialised', users.user)
                if (angular.isFunction(done)) {done(null, users.user)}
            }).error(function(d, status){
                console.log('Cant get user. err'+status)
            })
        }

        users.logout = function(done){
            chrome.runtime.getBackgroundPage(function(bkg){
                bkg.gh.signOut(function(err, status, message){
                    if(!err){
                        $rootScope.$broadcast('api:user.logout', users.user)
                        settings.set({});
                        users.user = {};
                        EXPIRED_USER_TIME = null;
                        done(null, message);
                    } else {
                        done({
                            'err': err,
                            'status': status,
                            'message': message
                        })
                    }
                });
            })
        }
        
        $rootScope.$on('api:TOKEN_SET', function(){users.getUser();});

        return users;
    }
]);
