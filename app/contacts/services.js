 angular.module('voxity.contacts').service('vxtApiContacts', [
    'vxtContactsConf', 'vxtCoreApi', 
    function(vxtContactsConf, api){
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

        function preSave(contactObj){
            if(angular.isObject(contactObj)){
                contactObj.telephoneNumber = contactObj.telephoneNumber ||''
                contactObj.phoneNumberRaccourci = contactObj.phoneNumberRaccourci || ''
                contactObj.employeeNumber = contactObj.employeeNumber || ''
                contactObj.mobile = contactObj.mobile || ''
                contactObj.mail = contactObj.mail || ''
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


        contacts.create = function(contactObj, done){

            if(!angular.isObject(contactObj)){
                return done({'data': {'errors': {'g': 'Aucun contact à mettre à jours'}}})
            } 
            if (contactObj.uid) {
                return done({'data': {'errors': {'g': 'Le contact possède un identifiant, il faut le mettr à jour'}}})
            }
            api.request({
                method: 'POST',
                url: contacts.base_uri,
                data: contactObj
            }).success(function(d){
                //return uid
                done(!d.result.uid, d.result.uid)
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

        contacts.update = function(contactObj, done){
            contactObj = angular.extend({}, contactObj);

            if(!angular.isObject(contactObj)){
                return done({'data': {'errors': {'g': 'Aucun contact à mettre à jours'}}});
            } 
            if (!contactObj.uid) {
                return done({'data': {'errors': {'g': 'Aucun identifiant pour le contact, il faut le creer'}}});
            }
            uid = contactObj.uid;
            delete contactObj.uid;
            api.request({
                method: 'PUT',
                url: contacts.base_uri + '/' + uid,
                data: preSave(contactObj)
            }).success(function(d){
                // return {uid:'', change: []}
                done(!d.result.uid, d.result)
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

        contacts.delete = function(uid, done){
            api.request({
                method: 'DELETE',
                url: contacts.base_uri + '/' + uid,
            }).success(function(d){
                // return {uid:'', change: []}
                done(!d.result.uid, d.result.uid)
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
    }
]);
