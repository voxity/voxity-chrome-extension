function sendSms() {
  var bkg = chrome.extension.getBackgroundPage();
  var phone_number = document.getElementById('sms-phone-number');
  var content = document.getElementById('sms-content');
  var status_error = document.getElementById('status-error');
  var status_success = document.getElementById('status-success');
  var loading = document.getElementById('loading');
  status_success.style.display = "none";
  status_error.style.display = "none";
  loading.style.display = "block";
  var ul = document.getElementById("list-errors");
  ul.innerHTML = ""; // we trash the content
  
  bkg.gh.makeSms(phone_number.value, content.value, function(err, http_status, response){
    loading.style.display = "none";

    //bkg.console.log("the response", response)
    // if there was any errors returned by the API
    if (response.error) 
    {
      status_error.style.display = "block";


      if (Array.isArray(response.error))
      {
        response.error.forEach(function(value, index){
            status_error.style.display = "block";
            var item = document.createElement("LI");
            var text;
            if (value.param === "phone_number")
              text = "Le numéro de téléphone doit être renseigné et valide";
            else if (value.param === "content")
              text = "Le contenu du message ne doit pas être vide";
            else if (value.param === "emitter")
              text = "Le label <Emetteur> doit faire une longueur entre 4 et 11 caractères";
            else 
              text = "Une erreur s'est produite";

            item.appendChild(document.createTextNode(text))
            ul.appendChild(item);
        });
      }
      else 
      {
        var item = document.createElement("LI");
        item.appendChild(document.createTextNode("Une erreur s'est produite"));
        ul.appendChild(item);
      }
    }
    // no error
    else
    {
      status_success.style.display = "block";
    }

    setTimeout(function() {
      if (! response.error) 
      {
        status_success.style.display = "none";
        phone_number.value = "";
        content.value = "";
      }

    }, 7500);
  });
}

// prefilling the phone_number field
chrome.tabs.getCurrent(function (tab){
  var bkg = chrome.extension.getBackgroundPage();
  var phone_number = document.getElementById('sms-phone-number');
  if (tab) phone_number.value = tab.url.split("?")[1].split("=")[1];
})
// adding a listener on the Send button 
document.getElementById('send-sms').addEventListener('click', sendSms);