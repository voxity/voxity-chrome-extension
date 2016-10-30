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
        sms.baseUri = smsConf.startPath;

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
            return (now - sms.messages.lastUpdateData ) > contactsConf.cacheDuration * 60000;
        }

        messages.clean = function(sms){
            if (angular.isObject(sms)) {
                sms.send_date = new Date(sms.send_date);
                sms.delivery_date = new Date(sms.delivery_date);
                return sms;
            } else {
                return sms;
            }
        }

        sms.messages.get = function(done, force){
            if (sms.messages.data === {} || messages.expiredData() || force){
                sms.messages.data = [];
                api.request({
                    url: sms.baseUri,
                }).success(function(d, status){
                    if (status == 200 && d.result) {
                        angular.forEach(d.result, function(elt, index){
                            sms.messages.data.push(messages.clean(elt));
                        });
                        sms.messages.data = $filter('orderBy')(sms.messages.data, '-send_date');
                        return done(null, sms.messages.data);
                    } else {
                        return done({'status': status, 'data':data})
                    }
                })
            } else {
                return done(err, this.data);
            }
        }

        return sms;

    }]
)