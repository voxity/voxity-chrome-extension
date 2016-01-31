/**
 *
 * @source: https://github.com/voxity/voxity-chrome-extension/blob/master/index.js
 *
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2015  Voxity
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

var base_url = 'https://api.voxity.fr'; 
// var base_url = 'http://localhost:3000'; 

/**
 * Makes an Oauth2 Implicit grant authentication
 * It replaces chrome.identity.launchWebAuth() that uses a cookie that is not accessible from the BackgroundPage
 * @param  {Function} callback Gives in parameter callback(err, responseUri)
 *
 * Redirect_uri : chrome-extension://{app_id}/oauth.html/
 */
var oauth_callback = null; // Global variable for being notified (by the oauth.html page) of the <redirect_uri> redirection
var oauth2 = function(opts, callback) {
    var interactive = (opts.interactive !== undefined)? opts.interactive : true;
    var url = opts.url || "";

    //Active OAuth2 Implicit Grant
    oauth_callback = callback;
    if (interactive) 
    {
        chrome.tabs.create({
            url: url,
            active: false
        }, function(tab) {
            chrome.windows.create({
                tabId: tab.id,
                url: url,
                type: 'popup',
                focused: true,
                width: 500,
                height: 500
            });
        });
    }
    else 
    {
        // we cannot do a normal xmlHtpRequest because the script in the page wouldn't be 
        // loaded and we cannot access to the full response url parameters neither
        // It should be possible to inject an iframe in the background page in goal to avoid 
        // opening a tab, since there no other way to hide a tab opening.
        chrome.tabs.create({
            url: url,
            active: false
        }, function(tab) {
            chrome.windows.create({
                tabId: tab.id,
                type: 'popup',
                focused: false,
                width: 1,
                height: 1
            });
        });
    }
}

var access_token;
var gh = (function() {
    'use strict';

    var tokenFetcher = (function() {
        var clientID = 'ch2NtN3S25ImoYHaSDsr';
        var redirectUri = chrome.extension.getURL("oauth.html"); //chrome.identity.getRedirectURL();
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
                        
                    oauth2(options, function(err, responseUri) {
                        if (err) return callback(new Error(err))
                        // Upon success the response is appended to redirectUri, e.g.
                        // chrome-extension://{app_id}/oauth.html#access_token={value}&expires_in=3600&token_type=Bearer
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
            // chrome.cookies.get({url: base_url, name:"api-voxity"}, function(cookie){
                // if the cookie doesn't exist or has expired then we launch an interative OAuth
                // var interactive = ! cookie || Date.now() > (new Date(cookie.expirationDate*1000)).getTime();
                var interactive = true;
                // console.log(cookie, interactive, new Date(cookie.expirationDate*1000))
                tokenFetcher.getToken(interactive, function(error, token) {
                    if (error) return callback(error);

                    access_token = token;
                    requestStart();
                });
            // });
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
            if (this.status == 401 && retry) {
                retry = false;
                tokenFetcher.removeCachedToken(access_token);
                access_token = null;
                getToken();
            } else if (this.status == 429) {
                var resp  = JSON.parse(this.response);
                notify("http.429", {title:'Trop de requêtes !', message:"Veuillez réessayer dans quelques secondes", context:resp.error});
            } else 
                callback(this.status < 200 || this.status >= 300, this.status, this.response); 
        }
    }

    function interactiveSignIn() {
        tokenFetcher.getToken(true, function(error, access_token) {});
    }

    function signOut(callback){
        var retry = true;
        var access_token;
        getToken(false);

        function getToken(interactive) {
            tokenFetcher.getToken(false, function(error, token) {
            if (error) return callback("Aucun token à supprimer.", null, null);;

            if(token){
                access_token = token;
                requestStart();
            }
          });
        }

        function requestStart() {
            var url = base_url + "/api/v1/logout";
            var xhr = new XMLHttpRequest();
            var requestBody = "";
            xhr.open("GET", url);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
            xhr.onload = requestComplete;
            xhr.send(requestBody);
        }

        function requestComplete() {
            if (this.status == 401) {
                retry = false;
                tokenFetcher.removeCachedToken(access_token);
                access_token = null;
                getToken(true);
            } else if (this.status == 429) {
                var resp  = JSON.parse(this.response);
                callback(null, this.status, "Trop de requete. Veuillez réessayer dans quelques secondes");
            } else if (this.status == 200) {
                tokenFetcher.removeCachedToken(access_token);
                access_token = null;
                callback(null, this.status, "Token supprimé. Déconnection validée.");
            } else {
                callback("Une erreur est survenue lors de la déconnection.", this.status, this.response);
            }
        }
    }

    return {
        tokenFetcher: tokenFetcher,
        signIn: function () {
          interactiveSignIn();
        },
        signOut: signOut,
        makeCall: function (exten) {
            var message = {
                action: base_url + '/api/v1/channel',
                method: "POST",
                parameters: JSON.stringify({'exten': exten})
            };
            function callback(err, status, response) {
                if (status === 200) 
                {
                    response = JSON.parse(response);
                    notify('make.call', {title:'Click-to-call', message:'Click-to-call', context:"Votre téléphone va sonner d\'ici quelques instants."});
                } else 
                {
                    notify('make.call', {title:'Click-to-call', message:'Une erreur est survenue', context:response.error});
                }
            }
            xhrWithAuth(message.method, message.action, message.parameters, true, callback);
        },
        makeSms: function (exten, content, done) {
            var message = {
                action: base_url + '/api/v1/sms',
                method: "POST",
                parameters: JSON.stringify({'phone_number': exten, "content":content})
            };
            function callback(err, status, response) {
                response = JSON.parse(response);
                done(status !== 200, status, response)
            }
            xhrWithAuth(message.method, message.action, message.parameters, true, callback);
        }
      };
})();

// Adding context item
chrome.runtime.onInstalled.addListener(function() {
    var contextType = "selection";
    chrome.contextMenus.create({"title": "Appeler le numéro <%s>", "contexts":[contextType], "id": "context_click_to_call"});  
    chrome.contextMenus.create({"title": "Envoyer un SMS à <%s>", "contexts":[contextType], "id": "context_sms"});  
});
chrome.contextMenus.onClicked.addListener(onClickHandler);

function onClickHandler(info, tab) {
    try{
        if (info.selectionText) {
            if (info.menuItemId == "context_click_to_call")
                gh.makeCall(info.selectionText);
           else if (info.menuItemId == "context_sms") {
                chrome.tabs.create({
                    url: chrome.extension.getURL('sms.html?phone_number='+info.selectionText),
                    active: false
                }, function(tab) {
                    chrome.windows.create({
                        tabId: tab.id,
                        type: 'popup',
                        focused: true,
                        //state: "normal"
                        width: 335,
                        height: 400 //350
                    });
                });
           }
        }
    } catch(ex){
        console.log(ex);
        gh.signIn();
    }
};

// Redirection listener
function browserActionRedirection (tab, code) { //Fired when User Clicks ICON
    chrome.tabs.update({url: "https://client.voxity.fr"});
};
chrome.browserAction.onClicked.addListener(browserActionRedirection);

// callto: click listener for sellsy integration
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if(sender.id !== chrome.runtime.id) return;
    gh.makeCall(message.exten);
})

// Events listener
var socket_client = new socketClient();
chrome.storage.sync.get({get_event_option:false}, function(items){
    if(items.get_event_option){ socket_client.connect(); }
});

chrome.storage.onChanged.addListener(function(changes, areaName){
    if(changes.hasOwnProperty('get_event_option') && changes.get_event_option.newValue === false){
        socket_client.disconnect();
    }
    if(changes.hasOwnProperty('get_event_option') && changes.get_event_option.newValue === true){
        socket_client.connect();
    }
})

/**
 * The data argument should contain takes a title
 * @param  {String} event               A type of event
 * @param  {Object} data                Object that contains 
 * @param  {String} data.title          The notification title
 * @param  {String} data.iconUrl        An icon path
 * @param  {String} data.message        The notification message bold
 * @param  {String} data.context        The notification message light
 */
function notify(event, data) {

    var opts = {
        type: 'basic', 
        iconUrl: data.iconUrl || 'libs/assets/icons/icon128.png',
        title: data.title || "", 
        message: data.message || "",
        contextMessage: data.context || "",
    }
 
    chrome.notifications.clear(event, function(wasCleared){
        chrome.notifications.create(event, opts, function(n) {});
    });
}