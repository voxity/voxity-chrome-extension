var gh = (function() {
  'use strict';

  var access_token;
  var User = {
    id:'',
    firstname:'',
    familyname:'',
    email:''
  };

  var tokenFetcher = (function() {
    var clientID = '';
    var clientSecret = '';
    var redirectUri = chrome.identity.getRedirectURL();
    var redirectRe = new RegExp(redirectUri + '[#\?](.*)');
    access_token = null;

    return {
      getToken: function(interactive, callback) {
        // In case we already have an access_token cached, simply return it.
        var options;

        chrome.storage.sync.get({
          clientID: '',
          clientSecret: '',
          access_token: null,
        }, function(items) {
          clientID = items.clientID;
          clientSecret = items.clientSecret;
          access_token = items.access_token;
          options = {
          'interactive': interactive,
          url:'https://api.voxity.fr/api/v1/dialog/authorize?client_id=' + clientID +
              '&response_type=code' +
              '&redirect_uri=' + encodeURI(chrome.identity.getRedirectURL())
          };
          if(access_token) {
            callback(null, access_token);
            return;
          }
          chrome.identity.launchWebAuthFlow(options, function(redirectUri) {
            if (chrome.runtime.lastError) {
              callback(new Error(chrome.runtime.lastError));
              return;
            }
            // Upon success the response is appended to redirectUri, e.g.
            // https://{app_id}.chromiumapp.org/provider_cb#access_token={value}
            //     &refresh_token={value}
            // or:
            // https://{app_id}.chromiumapp.org/provider_cb#code={value}
            var matches = redirectUri.match(redirectRe);
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
          if (values.hasOwnProperty('access_token'))
            setAccessToken(values.access_token);
          else if (values.hasOwnProperty('code'))
            exchangeCodeForToken(values.code);
          else callback(new Error('Neither access_token nor code avialable.'));
        }

        function exchangeCodeForToken(code) {
          var xhr = new XMLHttpRequest();
          var parameters = 'redirect_uri='+ chrome.identity.getRedirectURL() + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&code=' + code + '&grant_type=authorization_code';
          var requestBody = encodeURI(parameters);
          xhr.open('POST', 'https://api.voxity.fr/api/v1/oauth/token');
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.onload = function () {
            if (this.status === 200) {
              var response = JSON.parse(this.responseText);
              setAccessToken(response.access_token);
              access_token = response.access_token;
            }
          };
          xhr.send(requestBody);
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
        if (access_token == token_to_remove)
          access_token = null;
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
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
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
        action: 'https://api.voxity.fr/api/v1/channel',
        method: "POST",
        parameters: 'exten=' + exten
      };
      function onCallSuccess(req) {
        
      }
      xhrWithAuth(message.method, message.action, message.parameters, true, onCallSuccess);
    }
  };
})();

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.exten) {
    gh.makeCall(message.exten);
  }

  if (message.credentialsChanged) {
    gh.signIn();
  }
});