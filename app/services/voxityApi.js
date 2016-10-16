angular.module('voxityChromeApp').service('api', [
    '$http', '$rootScope',
    function($http, $rootScope) {
        var api = {};
        api.token = null;
        api.isInit = -1;
        api.user = null;
        api.baseUrl = null;
        api.versionPath = '/api/v1';
        api.refreshProcess = 0

        api.init = function(force){
            chrome.runtime.getBackgroundPage(function(bkg){
                api.signIn = bkg.gh.signIn
                api.baseUrl = bkg.gh.baseUrl;
                bkg.gh.tokenFetcher.getToken(true, function(err, token){
                    if (token){
                        api.token = token;
                        $http.defaults.headers.common.Authorization = 'Bearer ' + api.token;
                        $rootScope.$broadcast('api:TOKEN_SET', token)
                    }
                    api.isInit += 1;
                }, force);
                bkg.gh.whoami(function(err, user){
                    api.user = user
                    api.isInit += 1;
                })

            })
        }

        api.refresh = function(){
            api.refreshProcess += 1
            api.isInit -= 1;
            api.token = null;
            if (api.refreshProcess < 2) {
                api.init(true);
            }
        }

        api.request = function(args, done){
            var url = this.baseUrl + (args.versionPath || this.versionPath) + args.url;
            var method = args.method || "GET";
            var params = args.params || {};
            var args = args || {};
            var data = args.data || {};
            if (args.noToken) {
                var headers = {}
            } else {
                var headers = {
                    'Authorization': 'Bearer ' + this.token,
                }
            }
            return $http({
                'url': url,
                'method': method.toUpperCase(),
                'params': params,
                'data': data,
                'headers':headers
            })
        }

        $rootScope.$on('API:err.401', api.refresh)

        // -----
        return api;
    }
])
