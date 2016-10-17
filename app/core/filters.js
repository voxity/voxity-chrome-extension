angular.module('voxity.core').filter('phoneNumber',function(){
    return function(phoneInpt){
        var cleanPhone = phoneInpt;
        if(angular.isString(phoneInpt)){
            cleanPhone = phoneInpt.trim().replace(/(\s|\-|\.|_\,)/g, '');
            if(cleanPhone.match(/^0[1-79]\d{8}$/)){
                return cleanPhone.replace(/(.{2})/g,"$1 ");
            } else if(cleanPhone.match(/^\+\d{2}\d{8}$/)){
                var plus = cleanPhone.substring(0,3);
                var code = cleanPhone.substring(3,4);
                var endNum = cleanPhone.substring(4,12).replace(/(.{2})/g,"$1 ");
                return (plus + code + endNum).trim();
            }
        }
        return cleanPhone;
    }
});