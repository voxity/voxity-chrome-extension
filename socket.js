function socketClient(){
	socket = false;
	is_second_try = false;

	connect = function(){
		gh.tokenFetcher.getToken(true, function(err, token){
			if (err) return console.error('Authentication failed', err);
            access_token = token;

            socket = io.connect(base_url+'/', {
                forceNew: true,
                path : '/event/v1',
                query:"access_token="+access_token
            });

            socket.on('connected', function(data){
				is_second_try = false;
            })

            socket.on('reconnect', function(data){
            	console.log('reconnected', data);
            })

            socket.on('error', function(data){
                console.error('errors', data);
                data = JSON.parse(data);
                if (data.status == 401 && data.error === "invalid_token" && ! is_second_try) {
                    is_second_try = true;
                    gh.tokenFetcher.removeCachedToken(access_token);
                    gh.tokenFetcher.getToken(true, function(err, token){
                        // console.log(token)
                        access_token = token;
                        socket.disconnect();
                        socket.io.opts.query = "access_token="+access_token; 
                        socket.connect();
                    });
                }
            })

            socket.on('calls.ringing', function(data){
                if (data.calleridname !== 'Click-to-call')
                    notify('calls.ringing', {title: "Appel entrant", iconUrl:'libs/assets/icons/ringing.png', message: data.connectedlinename, context: data.connectedlinenum});
            })

            socket.on('calls.bridged', function(data){
                notify('calls.bridged', {title: "Communication établie entre", iconUrl:'libs/assets/icons/bridged.png', message: data.callerid1, context: data.callerid2});
            })

            socket.on('calls.hangup', function(data){
                notify('calls.hangup', {title: "Raccroché", iconUrl:'libs/assets/icons/hangup.png', message: data.connectedlinename, context:data.connectedlinenum});
            })

            socket.on('sms.response', function(data){
                // ["id", "phone_number", "send_date", "content"]
                notify('sms.response', {title: "Vous avez reçu un SMS", message: data.phone_number, context: data.content});
            })
            
            socket.on('sms.delivered', function(data){
                // ["id", "phone_number", "send_date"]
                notify('sms.delivered', {title: "Votre SMS a été délivré", message: data.phone_number, context: data.send_date});
            })
            
            socket.on('vms.delivered', function(data){
                // ["id", "phone_number"]
                notify('vms.delivered', {title: "Votre VMS a été délivré", message: data.phone_number, context: data.id});
            })
		});
	}

	disconnect = function(){
		socket.io.disconnect();
	}

    return {
    	connect: connect,
    	disconnect: disconnect
    };
}