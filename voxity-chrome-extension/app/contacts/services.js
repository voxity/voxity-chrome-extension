angular.module('voxity.contacts').service('vxtApiContacts', [
    '$filter', 'vxtContactsConf', 'vxtCoreApi', '$filter',
    function($filter, contactsConf, api, $filter){
        var contacts = {};
        var id = null;
        var lastUpdateData = null;
        contacts.data = [];

        contacts.base_uri = contactsConf.startPath;

        /**
         * Check if contacts.data is expired
         * @return {Boolean}
         */
        function experedData(){
            if (!lastUpdateData){return true;}
            var now = new Date();
            return (now - lastUpdateData ) > contactsConf.cacheDuration * 60000;
        }

        /**
         * set contacts list to contacts.data, and update last updateDAta
         * @param {list[Object,]} contactList  contact list from api query
         */
        function setData(contactList){
            if (angular.isArray(contactList)) {
                lastUpdateData = new Date();
                contacts.data = contactList
            }
        }

        /**
         * Update local data after 
         * @param  {Object} contact contact data
         * @param  {String} uid     contact uid
         * @param  {Boolean}uid     del     contact on list
         */
        function updateLocalContact(contact, uid, del){
            if (angular.isObject(contact)) {
                contact.uid = contact.uid || uid || null;
                var c = $filter('filter')(contacts.data, {'uid':contact.uid})

                if (contact.uid && !del) {
                    if(c.length === 0){
                        contacts.data.push(contact)
                    } else if(c.length === 1){
                        contacts.data[contacts.data.indexOf(c[0])] = contact;
                    }
                } else if  (contact.uid && del && c.length == 1) {
                    contacts.data.splice(contacts.data.indexOf(c[0]), 1);
                }

            }
        }

        /**
         * clan value, empty string to numm
         * @param  {String}         value String to Clean
         * @return {Sting|null}     Cleaned Value  
         */
        function cleanValue(value){
            if (angular.isString(value)){
                value = value.trim();
                if (value.length === 0) {value = null;}
            }
            return value;
        }

        /**
         * Clean Contact Object
         * @param  {Object} contactObj Contact object from api for exemple
         * @return {Object}            Contact Object with all attribut cleaned (see cleanValue)
         */
        function clean(contactObj){
            if(angular.isObject(contactObj)){
                contactObj.cn = cleanValue(contactObj.cn ||null);
                contactObj.telephoneNumber = cleanValue(contactObj.telephoneNumber ||null);
                contactObj.phoneNumberRaccourci = cleanValue(contactObj.phoneNumberRaccourci ||null);
                contactObj.employeeNumber = cleanValue(contactObj.employeeNumber ||null);
                contactObj.mobile = cleanValue(contactObj.mobile ||null);
                contactObj.mail = cleanValue(contactObj.mail ||null);
            }
            return contactObj
        }

        /**
         * clean Contact object beforede send query to update or create
         * @param  {Object} contactObj Object to clean
         * @return {Object}            cleaned object ready for send to API
         */
        function preSave(contactObj){
            if(angular.isObject(contactObj)){
                contactObj.telephoneNumber = contactObj.telephoneNumber || '';
                contactObj.phoneNumberRaccourci = contactObj.phoneNumberRaccourci || '';
                contactObj.employeeNumber = contactObj.employeeNumber || '';
                contactObj.mobile = contactObj.mobile || '';
                contactObj.mail = contactObj.mail || '';
            }
            return contactObj
        }

        /**
        * Get data list
         * @param  {Function}   done    (err, contacts)
         * @param  {Boolean}    force   force refresh data
         */
        contacts.get = function(done, force){
            if (experedData()) {
                api.request({
                    url: contacts.base_uri,
                }).success(function(d){
                    var cleanResp = [];
                    angular.forEach(d.result, function(elt, i){
                        cleanResp.push(clean(elt))
                    })
                    setData(cleanResp);
                    return done(null, cleanResp);
                }).error(function(d, status, head, config, statusText){return done({'data': d,'status': status,'head': head,'config': config,'statusText': statusText})})
            } else {return done(null, this.data)}
        }

        contacts.getId = function(uid, done){
            api.request({
                url: contacts.base_uri + '/' + uid,
            }).success(function(d){
                var c = clean(d.result[0]);
                updateLocalContact(c);
                done(null, c);
            }).error(function(d, status, head, config, statusText){return done({'data': d,'status': status,'head': head,'config': config,'statusText': statusText})})
        }


        /**
         * Create contact
         * @param  {Object}   contactObj  contact to create
         * @param  {Function} done       (err, uid)
         */
        contacts.create = function(contactObj, done){
            if(!angular.isObject(contactObj)){
                return done({'data': {'errors': {'g': 'Aucun contact à mettre à jours'}}})
            } 
            if (contactObj.uid) {
                return done({'data': {'errors': {'g': 'Le contact possède un identifiant, il faut le mettr à jour'}}})
            }
            if (contacts.validate(contactObj) != null) {
                return done({'data': {'errors': contacts.validate(contactObj)}});
            }
            api.request({
                method: 'POST',
                url: contacts.base_uri,
                data: preSave(contactObj)
            }).success(function(d){
                //return uid
                updateLocalContact(contactObj, d.result.uid);
                return done(!d.result.uid, d.result.uid)
            }).error(function(d, status, head, config, statusText){return done({'data': d,'status': status,'head': head,'config': config,'statusText': statusText})})
        }

        /**
         * update contact
         * @param  {Object}   contactObj  contact to update (must be contain uid attribut)
         * @param  {Function} done       (err, uid)
         */
        contacts.update = function(contactObj, done){
            contactObj = angular.extend({}, contactObj);

            if(!angular.isObject(contactObj)){
                return done({'data': {'errors': {'g': 'Aucun contact à mettre à jours'}}});
            } 
            if (!contactObj.uid) {
                return done({'data': {'errors': {'g': 'Aucun identifiant pour le contact, il faut le creer'}}});
            }
            if (contacts.validate(contactObj) != null) {
                return done({'data': {'errors': contacts.validate(contactObj)}});
            }
            uid = contactObj.uid;
            delete contactObj.uid;
            api.request({
                method: 'PUT',
                url: contacts.base_uri + '/' + uid,
                data: preSave(contactObj)
            }).success(function(d){
                // return {uid:'', change: []}
                updateLocalContact(contactObj, uid);
                return done(!d.result.uid, d.result)
            }).error(function(d, status, head, config, statusText){return done({'data': d,'status': status,'head': head,'config': config,'statusText': statusText})})

        }

        /**
         * delete contact from uid
         * @param  {String}   uid  contact uid
         * @param  {Function} done (err, uid)
         */
        contacts.delete = function(uid, done){
            api.request({
                method: 'DELETE',
                url: contacts.base_uri + '/' + uid,
            }).success(function(d){
                // return {uid:'', change: []}
                updateLocalContact({}, d.result.uid, true);
                return done(!d.result.uid, d.result.uid)
            }).error(function(d, status, head, config, statusText){return done({'data': d,'status': status,'head': head,'config': config,'statusText': statusText})})
        }

        /**
         * Find number in contact list.
         * @param  {String} num The number to find in local data list
         * @return {Array}     all contact have thi phoneNumber
         */
        contacts.findNumber = function(num){
            if (!contacts.data || contacts.data.length === 0) {
                return [];
            } else {
                var res = $filter('filter')(contacts.data, $filter('phoneNumber')(num, false))
                if (res.length === 0){
                    if (num.substring(0,1) === '+') {
                        res = $filter('filter')(contacts.data, num.substring(3))
                    } else if (num.substring(0,2) == '33'){
                        res = $filter('filter')(contacts.data, '0'+num.substring(2));
                    } else {
                        res = $filter('filter')(contacts.data, num.substring(1));
                    }
                    return res;
                } else {
                    return res;
                } 
            }
        }

        /**
         * Check mandatory attribut of contact
         * @param  {Object} c Contact Object to check
         * @return {Object|null}   return null if valid, containe Attribut key and list erros values,
         */
        contacts.validate = function(c){
            function addError(section, message){
                if(!errors[section]) errors[section] = [];
                errors[section].push(message);
            }
            var errors = {};
            var telReg = /^[+\d\(\)\.\ \-]+\d$/
            c = clean(c)

            if (!angular.isObject(c)) {
                addError('generals', 'Not valid Contact object'); 
                return errors;
            }
            // cn check, mandatory
            if (!c.cn) {
                addError('cn', 'Nom obligatoire'); 
            } else {
                if (!angular.isString(c.cn)) {
                    addError('cn', 'Le nom doit être une chaine de caractères.'); 
                } else{
                    if (c.length < 1) addError('cn', 'Le nom doit être une chaine de caractères.'); 
                }
            }
            // check telephoneNumber && mobile
            if (!c.telephoneNumber && !c.mobile || c.telephoneNumber && c.telephoneNumber.length === 0 && c.telephoneNumber && c.mobile.length === 0) {
                addError('telephoneNumber', 'Numéro de téléphone obligatoire');
            } else {
                if (c.telephoneNumber && !c.telephoneNumber.match(telReg)) addError('telephoneNumber', 'format invalide. [0-9+() -]');
                if (c.mobile && !c.mobile.match(telReg)) addError('mobile', 'format invalide. [0-9+() -]');
            }
            if (Object.keys(errors).length === 0) return null;
            return errors;
        }

        return contacts;
    }
]);
