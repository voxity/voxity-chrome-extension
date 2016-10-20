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
    
    var contactConf = this;
    //Temps de stockage dans l'application en secondes
    // par défaut 5 minutes
    this.cacheDuration = 5 ; // minutes
    this.getConf = function(){
        return {
            'cacheDuration': contactConf.cacheDuration
        }
    }
    this.checkValue = function(){
        var updatedValue = []
        if (!settingsService.checkValue('contact', 'cacheDuration', this.cacheDuration)) {
            updatedValue.push('cacheDuration');
        }

        if (updatedValue.length > 0) {
            angular.forEach(updatedValue, function(i, attr){
                contactConf.initDefault(i)
            }, function(){
                settingsService.set(contactConf.getConf(), 'contact')
            })
        }
    }

    this.initDefault = function(attribut){
        if (!attribut || attribut == 'cacheDuration') {}
        this.cacheDuration = settingsService.defaults.contact.cacheDuration.default;
        settingsService.set(contactConf.getConf(), 'contact')
    }

    this.startPath = '/contacts';

    this.$get = [function() {
        return {
            'cacheDuration': this.cacheDuration,
            'startPath': this.startPath
        }
    }];
}])