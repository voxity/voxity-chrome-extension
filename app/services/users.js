angular.module('voxityChromeApp').factory('apiUsers', [
    'api', '$rootScope', 
    function(api, $rootScope){
        var EXPIRED_USER_TIME = 2 * 60 * 60 * 1000 
        var users = {};
        users.user = {};

        function expiredUser(){
            return new Date() - users.user > EXPIRED_USER_TIME
        }

        users.getUser = function(done){
            if(!angular.isFunction(done)){
                done = function(){}
            }

            if (users.users !== {} && !expiredUser()){
                return done(null, users.users)
            } else {
                chrome.runtime.getBackgroundPage(function(bkg){
                    chrome.storage.sync.get('user', function(user){
                        users.user = user;
                        if (expiredUser()) {
                            init(done)
                        } else {
                            done(null, user)
                        }
                    }); 

                })
            }
        }

        users.init = function(done){
            chrome.runtime.getBackgroundPage(function(bkg){
                api.request({
                    url: '/users/self',
                }).success(function(d){
                    var user = d.result
                    user.last_syc = new Date();
                    users.user = user;
                    chrome.storage.sync.set({'user': user});
                    if (angular.isFunction(done)) {done(null, user)}
                    $rootScope.$broadcast('api:user.updated', user)
                }).error(function(d, status){
                    console.log('Cant get user. err'+status)
                })
            })
        }
        
        $rootScope.$on('api:TOKEN_SET', function(){users.getUser();});

        return users;
    }
])

