angular.module('voxity.sms').service('vxtApiSms', [
    'vxtCoreApi', 'vxtSmsConf', '$filter',
    function (api, smsConf, $filter) {
        var sms = {};
        sms.messages = {};
        sms.messages.data = null;
        sms.messages.lastUpdateData = null;
        sms.responses = {};
        sms.responses.data = {};
        sms.responses.lastUpdateData = null;

        var messages = {};
        var responses = {};
        sms.baseUri = smsConf.startPath;

        /**
         * check if object is sms response or not
         * @param  {Object}  sms Text Message object 
         * @return {Boolean}     true if is response
         */
        function isResponse(sms){
            if (angular.isObject(sms)) {
                return new Boolean(sms.id_sms_sent)
            } return undefined;
        }

        /**
         * Check if data is expired
         * @return {Boolean}
         */
        messages.expiredData = function(){
            if (!sms.messages.lastUpdateData){return true;}
            var now = new Date();
            return (now - sms.messages.lastUpdateData ) > smsConf.cacheDuration * 60000;
        }

        /**
         * Clean message send object
         * @param  {Object} sms Text Message to clean
         * @return {Object}     cleaned object
         */
        messages.clean = function(sms){
            if (angular.isObject(sms)) {
                sms.send_date = new Date(sms.send_date);
                if (sms.delivery_date) {
                    sms.delivery_date = new Date(sms.delivery_date);
                }
                return sms;
            } else {
                return sms;
            }
        }

        /**
         * Check if data is expired
         * @return {Boolean}
         */
        responses.expiredData = function(){
            if (!sms.messages.lastUpdateData){return true;}
            var now = new Date();
            return (now - sms.responses.lastUpdateData ) > smsConf.cacheDuration * 60000;
        }

        /**
         * Clean message response object
         * @param  {Object} sms Text Message to clean
         * @return {Object}     cleaned object
         */
        responses.clean = function(sms){
            if (angular.isObject(sms)) {
                sms.send_date = new Date(sms.send_date);
                return sms;
            } else {
                return sms;
            }
        }

        /**
         * Text message sended get from Voxity api
         * @param  {Function} done  Callback with 2 params err(Object), data:(list of Message Object) 
         * @param  {Book}   force   Force query to Api (ignore localCache);
         */
        sms.messages.get = function(done, force){
            if (sms.messages.data === {} || messages.expiredData() || force){
                sms.messages.data = [];
                api.request({
                    url: sms.baseUri,
                }).success(function(d, status){
                    if (status == 200 && d.result) {
                        sms.messages.lastUpdateData = new Date();
                        angular.forEach(d.result, function(elt, index){
                            sms.messages.data.push(messages.clean(elt));
                        });
                        sms.messages.data = $filter('orderBy')(sms.messages.data, '-send_date');
                        return done(null, sms.messages.data);
                    } else {
                        return done({'status': status, 'data':d})
                    }
                })
            } else {
                return done(null, sms.messages.data);
            }
        }

        /**
         * Text message response get from Voxity api
         * @param  {Function} done  Callback with 2 params err(Object), data:(list of ResmonseMessage Object) 
         * @param  {Book}   force   Force query to Api (ignore localCache);
         */
        sms.responses.get = function(done, force){
            if (sms.responses.data === {} || responses.expiredData() || force){
                sms.responses.data = [];
                api.request({
                    url: sms.baseUri + '/responses',
                }).success(function(d, status){

                    if (status == 200 && d.result) {
                        sms.responses.lastUpdateData = new Date();
                        angular.forEach(d.result, function(elt, index){
                            sms.responses.data.push(responses.clean(elt));
                        });
                        sms.responses.data = $filter('orderBy')(sms.responses.data, 'send_date');
                        return done(null, sms.responses.data);
                    } else {
                        return done({'status': status, 'data':d})
                    }
                })
            } else {
                return done(null, sms.responses.data);
            }
        }

        /**
         * Send text message
         * @param  {Object}   sms  contains attr content, phone_number, emitter
         * @param  {Function} done with 2 params : err, sms_result
         */
        sms.messages.post = function(mess, done){
            if(!angular.isFunction(done))  done = function(){};

            api.request({
                url: sms.baseUri,
                data: mess,
                method: 'POST'
            }).success(function(d, status){
                if (status == 200 && d.result) {
                    if (!angular.isArray(sms.messages.data)) sms.messages.data = [];

                    sms.messages.data.push(messages.clean(d.result));
                    sms.messages.data = $filter('orderBy')(sms.messages.data, 'send_date');
                    return done(null, messages.clean(d.result));
                } else {
                    return done({'status': status, 'data':d})
                }
            }).error(function(d, status) {
                return done({'status': status, 'data':d})
            });
        }

        /**
         * clean attribut message
         * @type {Object}
         */
        sms.clean = {
            /**
             * Clean PhoneNumber attribut of message *(pre send query for exemple)*. Remove all non integer char 
             * @param  {String} num   Phone number to clean
             * @return {String}       clean value
             */
            'phoneNumber': function(num){
                if(num && angular.isString(num)) {
                    if (num.substring(0,3) === "+33"){
                        num = '0' + num.substring(3);
                    }
                    if (num.substring(0,2) === "33"){
                        num = '0' + num.substring(2);
                    }
                    return num.replace(/[^\d]/g,'').trim()
                }
                return ''
            },
            /**
             * Clean emitter attribut of message. remove aull non alphabet letter (A-Z) char 
             * @param  {String} emitter emitter value to clean
             * @return {String}         cleaned emitter value 
             */
            'emitter': function(emitter){

                if(emitter && angular.isString(emitter)) {
                    return emitter.replace(/[^a-zA-Z]/g,'').trim()
                }
                return ''
            }
        }

        return sms;
    }]
)