angular.module('voxity.core').service('vxtCoreApi', [
    '$http', '$rootScope',
    function($http, $rootScope) {
        var api = {};
        api.token = null;
        api.isInit = -1;
        api.baseUrl = null;
        api.versionPath = '/api/v1';
        api.refreshProcess = 0

        api.init = function(force){
            chrome.runtime.getBackgroundPage(function(bkg){
                api.baseUrl = bkg.gh.baseUrl;
                bkg.gh.tokenFetcher.getToken(true, function(err, token){
                    if (token){
                        api.token = token;
                        $http.defaults.headers.common.Authorization = 'Bearer ' + api.token;
                        $rootScope.$broadcast('api:TOKEN_SET', token);
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
])

angular.module('voxity.core').service('settingsService', ['$rootScope', function($rootScope){

    var settings = {};

    settings.defaults = {
        'device': {
            'autoRefresh': {
                'type': 'boolean',
                'default': false
            },
            'refreshListInterval':{
                'type': 'number',
                'min': 5,
                'max': null,
                'default': 7.5
            }
        }
    }

    settings.values = {};
    settings.valuesUpdated = true;

    function getMainDefault(){
        return {
            'device': {
                'autoRefresh': settings.defaults.device.autoRefresh.default,
                'refreshListInterval': settings.defaults.device.refreshListInterval.default,
            }
        }
    }

    settings.get = function(done){
        if (this.valuesUpdated) {
            chrome.storage.sync.get({'wAppConf': null}, function(item){
                var wAppConf = item.wAppConf
                if (!wAppConf) {
                    settings.set(getMainDefault());
                    return done(null, getMainDefault())
                } else {
                    return done(null, wAppConf);
                }
            })

        } else {
            done(err, this.values)
        }
    }

    settings.set = function(data, section){
        if(section){
            this.values[section] = data;
        }
        chrome.storage.sync.set({'wAppConf': settings.values});
    }

    return settings;
}])

