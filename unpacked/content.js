let hassioConnection,
    hassUrl,
    access_token,
    token_type,
    client_id,
    grant_type = "refresh_token",
    refresh_token;

//page injected code to get home assistant object
let actualCode = '(' + function () {
  //check for hassConnection object
  if (typeof hassConnection != "undefined") {
    // found: send message back to content.js with object 
    hassConnection.then(function (result) {
      window.postMessage({
        type: "FROM_PAGE",
        prop: JSON.stringify(result)
      }, "*");
      //log console message of actiove 
      console.log("%c  HA RESTART BROWSER EXT  " + "\n%c       Version: 2.0       ", "background:black; color:orange", "background:grey; color:white");
    })
  } else {
    //hassConnection Object not found on page
    window.postMessage({
      type: "NOT_FOUND"
    }, "*");
  }
} + ')();';

// inject above code snippet 
function scriptInject() {
  let script = document.createElement('script');
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
    // set variables
    hassUrl = hassioConnection.auth.data.hassUrl;
    access_token = hassioConnection.auth.data.access_token;
    token_type = hassioConnection.auth.data.token_type;
    client_id = hassioConnection.auth.data.clientId;
    refresh_token = hassioConnection.auth.data.refresh_token;

    //call API to check it responds with details sourced
    hassCheckAPI(hassioConnection, function(result){
      if (result === "active") {
        chrome.runtime.sendMessage({
          "type": "showPageAction"
        });
      } else {
        // hassConnection found but API did not respond
        chrome.runtime.sendMessage({
          "type": "hidePageAction"
        });
      }
    });
  }

  if (event.data.type && (event.data.type == "NOT_FOUND")) {
    //console.log("HASS.IO NOT FOUND");
    chrome.runtime.sendMessage({
      "type": "hidePageAction"
    });
  }

}, false);


// button in browser is only active if hassio IO is detected with above code
// listens for message from background.js
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "clicked_browser_action") {

      //call function to check hass API still responds and access token hasn't expired
      hassCheckAPI(hassioConnection, function(result){
        if (result === "active") {
          // API responsed and access_token valid
          // call config check 
          hassConfigCheck();
        } else if(result === "unauthorised") {
          // API Responsed access_token has expired
          // call get new access_token
          getNewToken();
        } else {
          // hassConnection found but API did not respond
          // chrome.runtime.sendMessage({
          //   "type": "hidePageAction"
          // });
          chrome.runtime.sendMessage({
            "from": "content",
            "action": "notfound"
          });
        }
      });
    }
  }
);

function hassCheckAPI(hassioConnection, callback) {
  //console.log("hassio api check...");
  let xhr = new XMLHttpRequest();
  xhr.open('GET', hassUrl + '/api/');
  xhr.setRequestHeader("Content-tpe", "application/json");
  xhr.setRequestHeader("Authorization", token_type + " " + access_token);
  xhr.send()
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      //return true;
      callback("active")
      console.log('[API CHECK] success!', xhr.response);
    } else if(xhr.status >= 401) {
      callback("unauthorised");
      console.error('[API CHECK] 401 (Unauthorized) - getting new token');
    } else {
      //return false;
      callback("notavailable");
      console.error('[API CHECK] The request failed');
    }
  };
}

function getNewToken() {
  let formBody = [],
      urlEncodedData = "",
      requestBody = {
        'client_id': client_id,
        'refresh_token': refresh_token,
        'grant_type': grant_type
      };

  // Turn the data object into an array of URL-encoded key/value pairs.
  for (let property in requestBody) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(requestBody[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }

  // Combine the pairs into a single string and replace all %-encoded spaces to 
  // the '+' character; matches the behaviour of browser form submissions.
  urlEncodedData = formBody.join('&').replace(/%20/g, '+');

  // setup REST Api Call
  let xhr = new XMLHttpRequest();
  xhr.open('POST', hassUrl + '/auth/token');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(urlEncodedData);
  
  // Call a function when the state changes.
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      // Request finished. Do processing here.
      //console.log(JSON.parse(xhr.response));
      let response = JSON.parse(xhr.response);
      // set access token to new access token 
      access_token = response.access_token;
      // call config check
      hassConfigCheck()
    } else{
      console.error('[GET NEW TOKEN] The request failed');
    }
  }
}

function hassConfigCheck() {

  // show extension popup
  chrome.runtime.sendMessage({
    "type": "showPageAction"
  });

  let xhr = new XMLHttpRequest();
  xhr.open('POST', hassUrl + '/api/config/core/check_config');
  xhr.setRequestHeader("Content-tpe", "application/json");
  xhr.setRequestHeader("Authorization", token_type + " " + access_token);
  xhr.send();

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      //console.log(JSON.parse(xhr.response));
      let response = JSON.parse(xhr.response);
      if (response.result === "invalid") {
        chrome.runtime.sendMessage({
          "from": "content",
          "action": "configcheckerror",
          "message": response.errors
        });
      } else {
        chrome.runtime.sendMessage({
          "from": "content",
          "action": "configcheckdone"
        });
        hassRestart();
      }
    } else {
      console.error('[CONFIG CHECK] The request failed');
    }
  };
}

function hassRestart() {
  //need to call this before call or Firefox won't process before restart
  chrome.runtime.sendMessage({
    "from": "content",
    "action": "restartingdone"
  });

  let xhr = new XMLHttpRequest();
  xhr.open('POST', hassUrl + '/api/services/homeassistant/restart');
  xhr.setRequestHeader("Content-tpe", "application/json");
  xhr.setRequestHeader("Authorization", token_type + " " + access_token);
  xhr.send();

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
