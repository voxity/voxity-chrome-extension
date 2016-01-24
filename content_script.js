// Send message to the extension
window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type === "callto")) {
    console.log("Content script received: " + event.data.text);
    chrome.runtime.sendMessage(event.data);
  }
}, false);


var list = document.links;
for(i=0; i<list.length; i++){
    if (! list[i].href) continue;
    if (list[i].href.split(':')[0] !== "callto") continue;

    console.log('adding event');
    list[i].addEventListener('click', function(evt) {
        console.log(evt)
        var exten = evt.srcElement.href.split(':')[1];
        window.postMessage({ type:'callto', exten: exten}, "*");
    }, false);      
}
