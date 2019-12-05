let hassioConnection;
let hassioConnectionActive = false;

//page injected code to get home assistant object
var actualCode = '(' + function () {
  if (typeof hassConnection != "undefined") {
    hassConnection.then(function (result) {
      window.postMessage({
        type: "FROM_PAGE",
        prop: JSON.stringify(result)
      }, "*");
      console.log("%c  HA RESTART BROWSER EXT  " + "\n%c       Version: 0.2       ", "background:black; color:orange", "background:grey; color:white");
    })
  } else {
    window.postMessage({
      type: "NOT_FOUND"
    }, "*");
  }
} + ')();';

// inject above code snippet 
function scriptInject(){
  var script = document.createElement('script');
  script.textContent = actualCode;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
}
scriptInject();

// listen to results from page
window.addEventListener("message", function (event) {
  if (event.source != window)
    return;
  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    hassioConnection = JSON.parse(event.data.prop);
    hassCheckAPI();
    chrome.runtime.sendMessage({
      "type": "showPageAction"
    });
  }
  if (event.data.type && (event.data.type == "NOT_FOUND")) {
    //console.log("HASS.IO NOT FOUND");
    chrome.runtime.sendMessage({
      "type": "hidePageAction"
    });
  }
}, false);

// listens for message from background.js
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "clicked_browser_action") {

      hassCheckAPI();

      if (hassioConnectionActive) {
        hassConfigCheck();
      } else {
        chrome.runtime.sendMessage({
          "from": "content",
          "action": "notfound"
        });
      }
    }
  }
);

function hassCheckAPI() {
  //console.log("hassio api check...");
  var xhr = new XMLHttpRequest();
  xhr.open('GET', hassioConnection.auth.data.hassUrl + '/api/');
  xhr.setRequestHeader("Content-tpe", "application/json");
  xhr.setRequestHeader("Authorization", hassioConnection.auth.data.token_type + " " + hassioConnection.auth.data.access_token);
  xhr.send()
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      console.log('[API CHECK] success!', xhr.response);
      hassioConnectionActive = true;
    } else {
      //console.error('[API CHECK] The request failed!');
    }
  };
}

function hassConfigCheck() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', hassioConnection.auth.data.hassUrl + '/api/config/core/check_config');
  xhr.setRequestHeader("Content-tpe", "application/json");
  xhr.setRequestHeader("Authorization", hassioConnection.auth.data.token_type + " " + hassioConnection.auth.data.access_token);
  xhr.send()

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      console.log(JSON.parse(xhr.response));
      let response = JSON.parse(xhr.response);
      if(response.result === "invalid"){
        chrome.runtime.sendMessage({
          "from": "content",
          "action": "configcheckerror",
          "message": response.errors
        });
      } else{
        chrome.runtime.sendMessage({
          "from": "content",
          "action": "configcheckdone"
        });
        hassRestart();
      }
    } else {
    }
  };
}

function hassRestart() {
  chrome.runtime.sendMessage({
    "from": "content",
    "action": "restartingdone"
  });

  var xhr = new XMLHttpRequest();
  xhr.open('POST', hassioConnection.auth.data.hassUrl + '/api/services/homeassistant/restart');
  xhr.setRequestHeader("Content-tpe", "application/json");
  xhr.setRequestHeader("Authorization", hassioConnection.auth.data.token_type + " " + hassioConnection.auth.data.access_token);
  xhr.send()

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      //console.log(xhr.response);
      // chrome.runtime.sendMessage({
      //   "from": "content",
      //   "action": "restartingdone"
      // });
    } else {
      //console.log('The request failed!');
    }
  };
}