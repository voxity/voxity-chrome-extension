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
                    notify('ringing', data.connectedlinename, data.connectedlinenum);
            })

            socket.on('calls.bridged', function(data){
                notify('bridged', data.callerid1, data.callerid2);
            })

            socket.on('calls.hangup', function(data){
                notify('hangup', data.connectedlinename, data.connectedlinenum);
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