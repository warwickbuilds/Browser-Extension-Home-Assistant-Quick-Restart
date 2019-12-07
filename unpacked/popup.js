(function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"message":"clicked_browser_action"});
    });
})();


// listen for calls from content.js
chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse){
    if(request.from === "content"){
        if(request.action === "notfound"){
            document.getElementById("notfound").style.display = "block";
        }
        if(request.action === "configcheckerror"){
            document.getElementById("configcheck-loading").style.display = "none";
            document.getElementById("configcheck-error").style.display = "block";
            document.getElementById("error").innerText = request.message;
            document.getElementById("error").style.display = "block";
        }
        if(request.action === "configcheckdone"){
            document.getElementById("configcheck-loading").style.display = "none";
            document.getElementById("configcheck-done").style.display = "block";
            document.getElementById("restarting-loading").style.display = "block";
        }
        if(request.action === "restartingdone"){
            document.getElementById("restarting-loading").style.display = "none";
            document.getElementById("restarting-done").style.display = "block";
        }
    }
}
)