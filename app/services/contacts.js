 angular.module('voxityChromeApp').service('apiContacts', ['api', function(api){
    var contacts = {};
    contacts.base_uri = '/contacts';

    contacts.get = function(done){
        api.request({
            url: contacts.base_uri,
        }).success(function(d){
            done(null, d.result)
        }).error(function(d, status, head, config, statusText){
            done({
                'data': d,
                'status': status,
                'head': head,
                'config': config,
                'statusText': statusText
            })
        })
    }

    return contacts;
}]);
