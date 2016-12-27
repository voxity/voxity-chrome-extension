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
    /**
     * Time duration of stored data in application (in minute)
     * @type {Number}
     */
    this.cacheDuration = 1 ; // minutes

    this.startPath = '/sms';

    this.$get = [function() {
        return smsConf.getConf();
    }];
}]);