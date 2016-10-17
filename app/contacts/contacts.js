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
        })
    }
])

angular.module('voxity.contacts').provider('vxtContactsConf', [function () {
    
    //Temps de stockage dans l'application en secondes
    // par défaut 5 minutes
    this.storedDataTime = 5 ; // minutes

    this.startPath = '/contacts';

    this.$get = [function() {
        return this
    }];
}])