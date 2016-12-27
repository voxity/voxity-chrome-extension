angular.module('voxity.core').service('vxtCoreApi', [
    '$http', '$rootScope',
    function($http, $rootScope) {
        var api = {};
        api.token = null;
        api.isInit = -1;
        api.baseUrl = null;
        api.versionPath = '/api/v1';
        api.refreshProcess = 0

        function setToken(token){
            api.token = token;
            $http.defaults.headers.common.Authorization = 'Bearer ' + api.token;
            $rootScope.$broadcast('api:TOKEN_SET', token);
        }
        api.init = function(force){
            chrome.runtime.getBackgroundPage(function(bkg){
                api.baseUrl = bkg.gh.baseUrl;
                bkg.gh.tokenFetcher.getToken(false, function(err, token){
                    if (token){
                        setToken(token);

                    } else {
                        $rootScope.$broadcast('api:TOKEN_ERROR', null);
                    }
                    api.isInit += 1;
                }, force);
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
]);
