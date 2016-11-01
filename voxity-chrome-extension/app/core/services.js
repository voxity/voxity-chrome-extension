var settingsService = {};
settingsService.defaults = {
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
    },
    'contact': {
        'cacheDuration': {
            'type': 'number',
            'min': 2,
            'max': null,
            'default': 5
        }
    },
    'sms': {
        'cacheDuration': {
            'type': 'number',
            'min': 1,
            'max': null,
            'default': 3
        },
        'defaultEmitter': {
            'type': 'boolean',
            'default': false,
        },
        'defaultEmitterValue': {
            'type': 'string',
            'default': '',
        }
    }
}

settingsService.checkValue = function(section, varname, value){
    if (this.defaults[section] && this.defaults[section][varname]) {    
        if (this.defaults[section][varname].type === 'number') {
            if (!angular.isNumber(value)) {return 0}
            if (this.defaults[section][varname].min && this.defaults[section][varname].min > value) {return 0}
            if (this.defaults[section][varname].max && this.defaults[section][varname].max < value) {return 0}
            return 1
        }
        return 1
    } else {
        console.log('settingsService.checkValue : error, section ['+ section +']['+varname+'] not found in default' )
        return -1;
    }
}

settingsService.values = {};
settingsService.valuesUpdated = true;

function getMainDefault(){
    return {
        'device': {
            'autoRefresh': settingsService.defaults.device.autoRefresh.default,
            'refreshListInterval': settingsService.defaults.device.refreshListInterval.default,
        },
        'sms':{
            'cacheDuration': settingsService.defaults.sms.cacheDuration.default,
            'defaultEmitter': settingsService.defaults.sms.defaultEmitter.default,
            'defaultEmitterValue': settingsService.defaults.sms.defaultEmitterValue.default,
        } 
    }
}

settingsService.get = function(done){
    if (this.valuesUpdated) {
        chrome.storage.sync.get({'wAppConf': null}, function(item){
            var wAppConf = item.wAppConf
            if (!wAppConf) {
                settingsService.set(getMainDefault());
                return done(null, getMainDefault())
            } else {
                return done(null, wAppConf);
            }
        })

    } else {
        done(err, this.values)
    }
}

settingsService.set = function(data, section){
    this.get(function(err, conf){
        if (section) {
            conf[section] = data;
        } else {conf = data;}
        chrome.storage.sync.set({'wAppConf': conf});
        settingsService.values = conf;

    })
};

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
]);

angular.module('voxity.core').service('settingsService', ['$rootScope', function($rootScope){
    return settingsService;
}]);

