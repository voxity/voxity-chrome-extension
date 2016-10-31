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
    // par défaut 5 minutes
    this.cacheDuration = 1 ; // minutes
    this.getConf = function(){
        return {
            'cacheDuration': smsConf.cacheDuration
        }
    }
    this.checkValue = function(){
        var updatedValue = []
        if (!settingsService.checkValue('sms', 'cacheDuration', this.cacheDuration)) {
            updatedValue.push('cacheDuration');
        }

        if (updatedValue.length > 0) {
            angular.forEach(updatedValue, function(i, attr){
                contactConf.initDefault(i);
            }, function(){
                settingsService.set(contactConf.getConf(), 'sms');
            });
        }
    }

    this.initDefault = function(attribut){
        if (!attribut || attribut == 'cacheDuration') {}
        this.cacheDuration = settingsService.defaults.contact.cacheDuration.default;
        settingsService.set(contactConf.getConf(), 'sms');
    }

    this.startPath = '/sms';

    this.$get = [function() {
        return {
            'cacheDuration': this.cacheDuration,
            'startPath': this.startPath
        };
    }];
}]);