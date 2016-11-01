angular.module('voxity.sms', [
    'voxity.core',
    'angular.filter',
]);

angular.module('voxity.sms').config(['$routeProvider',
    function(rp) {
        rp.when('/sms', {
            'templateUrl': 'views/sms/recipients-list.html',
            'controller': 'vxtSmsCtrl'
        });
         rp.when('/sms/send', {
            'templateUrl': 'views/sms/form.html',
            'controller': 'vxtSmsFormCtrl'
        });
        rp.when('/sms/chat/:smsPhoneNumber', {
            'templateUrl': 'views/sms/chat.html',
            'controller': 'vxtSmsChatCtrl'
        });
    }
]);

angular.module('voxity.sms').provider('vxtSmsConf', [function () {
    
    var smsConf = this;
    //Temps de stockage dans l'application en secondes
    // par défaut 1 minutes
    this.cacheDuration = 1 ; // minutes
    this.getConf = function(){
        return {
            'cacheDuration': smsConf.cacheDuration,
            'defaultEmitter': smsConf.defaultEmitter,
            'defaultEmitterValue': smsConf.defaultEmitterValue,
            'startPath': smsConf.startPath,
        }
    }
    this.checkValue = function(){
        var updatedValue = []
        if (!settingsService.checkValue('sms', 'cacheDuration', this.cacheDuration)) {
            updatedValue.push('cacheDuration');
        }
        if (!settingsService.checkValue('sms', 'defaultEmitter', this.defaultEmitter)) {
            updatedValue.push('defaultEmitter');
        }
        if (!settingsService.checkValue('sms', 'defaultEmitterValue', this.defaultEmitterValue)) {
            updatedValue.push('defaultEmitterValue');
        }

        if (updatedValue.length > 0) {
            angular.forEach(updatedValue, function(i, attr){
                smsConf.initDefault(i);
            }, function(){
                settingsService.set(smsConf.getConf(), 'sms');
            });
        }
    }

    this.initDefault = function(attribut){
        if (!attribut || attribut == 'cacheDuration') {
            this.cacheDuration = settingsService.defaults.sms.cacheDuration.default;
        }
        if (!attribut || attribut == 'defaultEmitter') {
            this.defaultEmitter = settingsService.default.sms.defaultEmitter.default
        }
        if (!attribut || attribut == 'defaultEmitterValue') {
            this.defaultEmitterValue = settingsService.default.sms.defaultEmitterValue.default
        }
        settingsService.set(smsConf.getConf(), 'sms');
    }

    this.startPath = '/sms';

    this.$get = [function() {
        return smsConf.getConf();
    }];
}]);