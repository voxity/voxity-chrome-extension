 angular.module('voxityChromeApp').service('apiContacts', ['api', function(api){
    var contacts = {};
    contacts.base_uri = '/contacts';

    function cleanValue(value){
        if (angular.isString(value)){
            value = value.trim();
            if (value.length === 0) {
                value = null;
            }
        }

        return value;
    }

    function clean(contactObj){
        if(angular.isObject(contactObj)){
            contactObj.cn = cleanValue(contactObj.cn ||null);
            contactObj.telephoneNumber = cleanValue(contactObj.telephoneNumber ||null)
            contactObj.phoneNumberRaccourci = cleanValue(contactObj.phoneNumberRaccourci ||null)
            contactObj.employeeNumber = cleanValue(contactObj.employeeNumber ||null)
            contactObj.mobile = cleanValue(contactObj.mobile ||null)
            contactObj.mail = cleanValue(contactObj.mail ||null)
        }
        return contactObj
    }

    contacts.get = function(done){
        api.request({
            url: contacts.base_uri,
        }).success(function(d){
            var cleanResp = [];
            angular.forEach(d.result, function(elt, i){
                cleanResp.push(clean(elt))
            })
            done(null, cleanResp)
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

    contacts.getId = function(uid, done){
        api.request({
            url: contacts.base_uri + '/' + uid,
        }).success(function(d){
            done(null, clean(d.result[0]))
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
