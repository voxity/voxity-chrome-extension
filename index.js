/**
 *
 * @source: https://github.com/voxity/voxity-chrome-extension/blob/master/index.js
 *
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2014  Voxity
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

// var base_url = 'https://api.voxity.fr'; 
// var base_url = 'http://localhost:3000'; 
var base_url = 'http://192.168.16.161'; 

var access_token;
var gh = (function() {
    'use strict';


    var tokenFetcher = (function() {
        var clientID = 'ch2NtN3S25ImoYHaSDsr';
        var redirectUri = chrome.identity.getRedirectURL();
        var redirectRe = new RegExp(redirectUri + '[#\?](.*)');
        access_token = null;

        return {
            getToken: function(interactive, callback) {
                // In case we already have an access_token cached, simply return it.
                var options;

                chrome.storage.sync.get({
                  access_token: null,
                }, function(items) {
                    access_token = items.access_token;
                    if(access_token) return callback(null, access_token);
                    
                    options = {
                        'interactive': interactive,
                        url: base_url + '/api/v1/dialog/authorize?client_id=' + clientID +
                            '&response_type=token' +
                            '&redirect_uri=' + redirectUri
                    };
                        
                    chrome.identity.launchWebAuthFlow(options, function(responseUri) {
                        if (chrome.runtime.lastError) return callback(new Error(chrome.runtime.lastError))
                        // Upon success the response is appended to redirectUri, e.g.
                        // https://{app_id}.chromiumapp.org/provider_cb#access_token={value}&refresh_token={value}
                        // or:
                        // https://{app_id}.chromiumapp.org/provider_cb#code={value}
                        var matches = responseUri.match(redirectRe);
                        if (matches && matches.length > 1)
                            handleProviderResponse(parseRedirectFragment(matches[1]));
                        else
                            callback(new Error('Invalid redirect URI'));
                    });
                });

                function parseRedirectFragment(fragment) {
                    var pairs = fragment.split(/&/);
                    var values = {};

                    pairs.forEach(function(pair) {
                        var nameval = pair.split(/=/);
                        values[nameval[0]] = nameval[1];
                    });

                    return values;
                }

                function handleProviderResponse(values) {
                    if (values.hasOwnProperty('access_token')){
                        if (! values.access_token) return callback(new Error('Authentication failed'));
                        setAccessToken(values.access_token);
                    } else
                        callback(new Error('No access_token available.'));
                }

                function setAccessToken(token) {
                    access_token = token;
                    chrome.storage.sync.set({
                        access_token: token
                    }, function() {
                        callback(null, access_token);
                    });
                }
            },

            removeCachedToken: function(token_to_remove) {
                if (access_token === token_to_remove) {
                  chrome.storage.sync.remove("access_token"); //when the token is expired we must delete it from the storage in goal to ask a new one
                  access_token = null;
                }
            }
        };
    })();

    function xhrWithAuth(method, url, params, interactive, callback) {
        var retry = true;
        getToken();

        function getToken() {
            tokenFetcher.getToken(interactive, function(error, token) {
            if (error) return callback(error);

            access_token = token;
            requestStart();
          });
        }

        function requestStart() {
            var xhr = new XMLHttpRequest();
            var requestBody = params;
            xhr.open(method, url);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
            xhr.onload = requestComplete;
            xhr.send(requestBody);
        }

        function requestComplete() {
            // if ( && this.response === "Unauthorized")
            console.log(this)
            if (this.status == 401 && retry) {
                retry = false;
                tokenFetcher.removeCachedToken(access_token);
                access_token = null;
                getToken();
            } else if (this.status == 429) {
                var resp  = JSON.parse(this.response);
                console.log(resp)
                notify('Trop de requêtes !', "Veuillez réessayer dans quelques secondes", res.error);
            } else if (this.status == 400) {
                var resp  = JSON.parse(this.response);
                notify('Une erreur est survenue', resp.error);
            } else {
                callback(null, this.status, this.response);
            }
        }
    }

    function interactiveSignIn() {
        tokenFetcher.getToken(true, function(error, access_token) {});
    }

    return {
        tokenFetcher: tokenFetcher,
        signIn: function () {
          interactiveSignIn();
        },
        makeCall: function (exten) {
            var message = {
                action: base_url + '/api/v1/channel',
                method: "POST",
                parameters: JSON.stringify({'exten': exten})
            };
            function onCallSuccess(val, status, response) {
                response = JSON.parse(response);
                notify('Click-to-call', 'Click-to-call', "Votre téléphone va sonner d\'ici quelques instants.")
            }
            xhrWithAuth(message.method, message.action, message.parameters, true, onCallSuccess);
        }
      };
})();

// Adding context item
chrome.runtime.onInstalled.addListener(function() {
    var context = "selection";
    var title = "Appeler le numéro <%s>";
    var id = chrome.contextMenus.create({"title": title, "contexts":[context], "id": "context" + context});  
});
chrome.contextMenus.onClicked.addListener(onClickHandler);

function onClickHandler(info, tab) {
    try{
        if (info.selectionText) {
            gh.makeCall(info.selectionText);
        }
    } catch(ex){
        console.log(ex);
        gh.signIn();
    }
};

// Redirection listener
chrome.browserAction.onClicked.addListener(function (tab) { //Fired when User Clicks ICON
    chrome.tabs.update({url: "https://client.voxity.fr"});
});

// callto: click listener for sellsy integration
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if(sender.id !== chrome.runtime.id) return;
    gh.makeCall(message.exten);
})

// Events listener
var socket, is_second_try = false;
gh.tokenFetcher.getToken(true, function(err, token){
    if (err) return console.error('Authentication failed', err);

    console.log(token);
    access_token = token;
    socket = io.connect(base_url+'/', {
        path : '/event/v1',
        query:"access_token="+access_token
    });
    
    socket.on('connected', function(data){
        console.log('connected', data);
        is_second_try = false;
    })

    socket.on('error', function(data){
        console.log('errors', data);
        data = JSON.parse(data);
        if (data.status == 401 && data.error === "invalid_token" && ! is_second_try) {
            is_second_try = true;
            gh.tokenFetcher.removeCachedToken(access_token);
            gh.tokenFetcher.getToken(true, function(err, token){
                console.log(token)
                access_token = token;
                socket.disconnect();
                socket.io.opts.query = "access_token="+access_token; 
                socket.connect();
            });
        }
    })

    socket.on('calls.ringing', function(data){
        console.log('RINGING', data);
        if (data.calleridname !== 'Click-to-call')
            notify('ringing', data.connectedlinename, data.connectedlinenum);
    })

    socket.on('calls.bridged', function(data){
        console.log('BRIDGED', data);
        notify('bridged', data.callerid1, data.callerid2);
    })

    socket.on('calls.hangup', function(data){
        console.log('HANGUP', data);
        notify('hangup', data.connectedlinename, data.connectedlinenum);
    })
});

function notify(type, msg, context) {
    var title;
    var opts = {
        type: 'basic', 
        iconUrl: 'icon128.png',
        title: title || "", 
        message: msg || "",
        contextMessage: context || "",
    }
    switch (type){
        case "ringing" :    
            opts.title = "Appel entrant"; 
            opts.iconUrl = 'ringing.png'; 
            break;
        case "hangup" :     
            opts.title = "Raccroché"; 
            opts.iconUrl = 'hangup.png'; 
            break;
        case "bridged" :    
            opts.title = "Communication établie entre"; 
            opts.iconUrl = 'bridged.png'; 
            break;
        case "Click-to-call" :    
            opts.iconUrl = 'ringing.png'; 
            break;
        default :           
            opts.title = type; 
            break;
    }
 
    chrome.notifications.clear(type, function(wasCleared){
        chrome.notifications.create(type, opts, function(n) {});
    });
}