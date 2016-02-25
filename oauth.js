(function(){
  // we notify the background page of the redirection, along with the access_token
  chrome.runtime.getBackgroundPage(function(bkg){
  if (bkg.oauth_callback) 
    bkg.oauth_callback(null, window.location.href)
  
  bkg.oauth_callback = null;
  
  // we close the current oauth2 popup
  window.open('', '_self', '');
  window.close();
  });
})()