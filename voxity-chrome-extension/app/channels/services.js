angular.module('voxity.channels').service('vxtApiChannels', ['vxtCoreApi', function(api){
    var channels = {};

    channels.baseUri = '/channels';

    /**
     * get all curent channels
     * @param  {Function} done  (err, channels)
     */
    channels.get = function(done){
        api.request({'url': channels.baseUri, data: {'exten': exten}}).
        success(function(d, status){
            done(status === 200, d.data.result.channel_id);
        }).error(function(d, status, head, config, statusText){
            done({
                'data': d,
                'status': status,
                'head': head,
                'config': config,
                'statusText': statusText
            });
        });

    }

    /**
     * Create channels, like click2call
     * @param  {String}   exten Exten to call
     * @param  {Function} done  (err, channelsID)
     * @return {[type]}         [description]
     */
    channels.post = function(exten, done){
        if(angular.isNumber(exten)){
            exten = ('' + exten).trim();
        } else if(angular.isString(exten)){
            exten = exten.trim();
        } else {
            return done({'errors': {'exten': 'type invalide'}});
        } 

        api.request({
            'url': channels.baseUri,
            'method': 'POST',
            'data': {'exten': exten}
        }).success(function(d, status){
            done(null, d.data);
        }).error(function(d, status, head, config, statusText){
            done({
                'data': d,
                'status': status,
                'head': head,
                'config': config,
                'statusText': statusText
            });
        });
    }

    return channels;
}]);
