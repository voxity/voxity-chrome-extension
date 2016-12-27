angular.module('voxity.contacts', [
    'voxity.core',
    'voxity.channels',
    'voxity.users',
]);

angular.module('voxity.contacts').config(['$routeProvider',
    function(rp) {
        rp.when('/contacts', {
            'templateUrl': 'views/contacts/list.html',
            'controller': 'vxtContactsCtrl'
        }).when('/contacts/add', {
            'templateUrl': 'views/contacts/form.html',
            'controller': 'vxtContactFormCtrl'
        }).when('/contact/:contactId/edit', {
            'templateUrl': 'views/contacts/form.html',
            'controller': 'vxtContactFormCtrl'
        }).when('/contact/:contactId', {
            'templateUrl': 'views/contacts/detail.html',
            'controller': 'vxtContactCtrl'
        });
    }
]);

angular.module('voxity.contacts').provider('vxtContactsConf', [function () {
    
    var contactConf = this;
    /**
     * The time in minutes to cache contact list
     * @type {Number}
     */
    this.cacheDuration = 5 ;

    this.startPath = '/contacts';

    this.$get = [function() {
        return {
            'cacheDuration': this.cacheDuration,
            'startPath': this.startPath
        };
    }];
}]);