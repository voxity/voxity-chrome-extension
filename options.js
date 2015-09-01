// Saves options to chrome.storage.sync.
function save_options() {
  var get_event_option = document.getElementById('get_event_option').checked;
  chrome.storage.sync.set({
    get_event_option: get_event_option,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 7500);
  });
}

function erase_token_api(){
  var bkg = chrome.extension.getBackgroundPage();
  bkg.gh.signOut(function(err, http_status, reponse){
    var status = document.getElementById('status');
    if(err){
      status.textContent = err;
    }else{
      if(http_status === 200){
        status.textContent = reponse;
        var tokenapi = document.getElementById('tokenapi');
        tokenapi.textContent = "Aucun token, veuillez vous connecter."
      }
    }
    setTimeout(function() {
      status.textContent = '';
    }, 7500);
  })
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    access_token: null,
    get_event_option: false,
  }, function(items) {
    access_token = "Aucun token, veuillez vous connecter."
    if(items.access_token){
      access_token = items.access_token.substring(0,40);
      access_token = access_token + "..."
    }
    document.getElementById('tokenapi').innerHTML = access_token;
    if(items.get_event_option){
      document.getElementById('get_event_option').checked = items.get_event_option;
    }
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('deltokenapi').addEventListener('click', erase_token_api);
document.getElementById('save').addEventListener('click', save_options);