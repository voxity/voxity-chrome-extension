angular.module('voxity.core').filter('phoneNumber',function(){
    return function(phoneInpt, space){
        if (angular.isUndefined(space)) {
            space = true;
        }

        var cleanPhone = phoneInpt;
        if(angular.isString(phoneInpt)){
            cleanPhone = phoneInpt.trim().replace(/(\s|\-|\.|_\,)/g, '');
            if(cleanPhone.match(/^0[1-79]\d{8}$/)){
                if(space){
                    return cleanPhone.replace(/(.{2})/g,'$1 ');
                } else {
                    return cleanPhone.replace(/\s/g, '');
                }
            } else if(cleanPhone.match(/^\+\d{2}\d{9}$/)){
                var plus = cleanPhone.substring(0,3);
                if (plus = "+33"){
                    plus = '0';
                }
                var code = cleanPhone.substring(3,4);
                if(space){
                    var endNum = cleanPhone.substring(4,12).replace(/(.{2})/g,"$1 ");
                    if (plus.substring(0,1)!= '+'){
                        return (plus + code + ' ' + endNum).trim();
                    } else {
                        return (plus + code + endNum).trim();
                    }
                } else {
                    var endNum = cleanPhone.substring(4,12).replace(/\s/g,"");
                    if (plus.substring(0,1)!= '+'){
                        return (plus + code + endNum).trim();
                    } else {
                        return (plus + code + endNum).trim();
                    }
                }
            }
        }
        return cleanPhone;
    }
});