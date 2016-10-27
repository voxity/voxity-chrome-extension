angular.module('voxity.users').service('vxtApiUsers', [
    'vxtCoreApi', '$rootScope', 
    function(api, $rootScope){
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
                if (angular.isFunction(done)) {done(null, user)}
            }).error(function(d, status){
                console.log('Cant get user. err'+status)
            })
        }

        users.logout = function(done){
            chrome.runtime.getBackgroundPage(function(bkg){
                bkg.gh.signOut(done);
            })
        }
        
        $rootScope.$on('api:TOKEN_SET', function(){users.getUser();});

        return users;
    }
]);
