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

var gh = (function() {
  'use strict';

  var access_token;

  var tokenFetcher = (function() {
    var clientID = 'v009';
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
          options = {
            'interactive': interactive,
            url:'http://localhost:3000/api/v1/dialog/authorize?client_id=' + clientID +
                '&response_type=token' +
                '&redirect_uri=' + redirectUri
          };
          if(access_token) {
            callback(null, access_token);
            return;
          }
          chrome.identity.launchWebAuthFlow(options, function(responseUri) {
            if (chrome.runtime.lastError) {
              callback(new Error(chrome.runtime.lastError));
              return;
            }
            // Upon success the response is appended to redirectUri, e.g.
            // https://{app_id}.chromiumapp.org/provider_cb#access_token={value}
            //     &refresh_token={value}
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
          if (values.hasOwnProperty('access_token')) {
            setAccessToken(values.access_token);
          } else {
            callback(new Error('No access_token available.'));
          }
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
        if (access_token == token_to_remove) {
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
        if (error) {
          callback(error);
          return;
        }
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
      if (this.status != 200 && retry) {
        retry = false;
        tokenFetcher.removeCachedToken(access_token);
        access_token = null;
        getToken();
      } else {
        callback(null, this.status, this.response);
      }
    }
  }

  function interactiveSignIn() {
    tokenFetcher.getToken(true, function(error, access_token) {

    });
  }

  return {
    signIn: function () {
      interactiveSignIn();
    },
    makeCall: function (exten) {
      var message = {
        action: 'http://localhost:3000/api/v1/channel',
        method: "POST",
        parameters: JSON.stringify({'exten': exten})
      };
      function onCallSuccess(val, status, response) {
        response = JSON.parse(response);
        var title = null;
        var message = null;

        if(response.status === 1){
          title = 'Demande validée';
          message = 'Votre téléphone va sonner d\'ici quelques instants.';
        }else{
          title = response.data.title;
          message = response.data.message;
        }

        var notification_vars = {
          type: 'basic', 
          iconUrl: 'icon128.png',
          title: title, 
          message: message 
          }

        chrome.notifications.getAll(function(notifications){
          if(notifications.clicktocall){
            chrome.notifications.clear('clicktocall', function(e){});
          }
        })

        chrome.notifications.create(
          'clicktocall',
          notification_vars,
          function(n) {} );
      }
      xhrWithAuth(message.method, message.action, message.parameters, true, onCallSuccess);
    }
  };
})();

chrome.runtime.onInstalled.addListener(function() {
  var context = "selection";
  var title = "Appeler le numéro <%s>";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                         "id": "context" + context});  
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
