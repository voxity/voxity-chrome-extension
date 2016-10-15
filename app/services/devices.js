angular.module('voxityChromeApp').service('apiDevices', ['api', function(api){
    var devices = {};
    devices.base_uri = '/devices';
    devices._DESCRIPTIONS = {
        'unavailable': "non connecté",
        'available': 'disponible',
        'ring': 'sonne',
        'ringing': 'sonne',
        'in-use': 'en communication',
        'unknow': 'iconnue'
    }

    function clean(deviceObj){
        if(angular.isObject(deviceObj)){
            deviceObj.last_update = new Date(deviceObj.last_update);
        }
        return deviceObj;
    }

    devices.get = function(done){
        api.request({
            url: devices.base_uri,
            params:{details:'true'}
        }).success(function(d){
            done(null, d.data)
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

    devices.getId = function(id, done){
        api.request({
            url: devices.base_uri + '/' + id,
            params:{details:'true'}
        }).success(function(d){
            done(null, clean(d.data))
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

    devices.getIconClassStatus = function(state){
        var def = "fa fa-phone-square";
        var icon_class = '';
        if (state == 0){
            icon_class = def + " text-success"
        } else if(state == 2){
            icon_class = def + " text-danger animated infinite flash"
        } else if(state == 3){
            icon_class = def + " text-danger"
        } else if(state == 5){
            icon_class = def + " text-muted"
        } else {
            icon_class = "fa fa-question-circle text-muted"
        }
        return icon_class
    }

    devices.frDescription = function(desc){
        if(angular.isString(desc)){
            console.log(devices._DESCRIPTIONS)
            try {return devices._DESCRIPTIONS[desc.toLowerCase()] || 'Inconnue';}
            catch(e){return 'Inconnue'}
        } else {
            return 'Inconnue';
        }
    }

    devices.getName = function(callerId){
        if(angular.isString(callerId)){
            return callerId.substring(0, callerId.lastIndexOf('<') - 1).trim()
        } else {return undefined}
    }

    devices.getExten = function(callerId){
        if(angular.isString(callerId)){
            callerId = callerId.trim()
            return callerId.substring(callerId.lastIndexOf('<') + 1, callerId.length - 1).trim()
        } else {return undefined}
    }

    // ----
    return devices;
}])